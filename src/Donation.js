import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import { SocialIcon } from 'react-social-icons';

class Donation extends Component { 

	render() {

		var address = 'bitcoincash:qqvexknjrdf0kjs24q8s9utjuphswkkv8g96s0p2mj'

		return (
			<div style={{paddingLeft:'50px'}}>

				<h4 style={{padding:"20px", background:'#fdd'}}>Thank you for supporting Ace Tipper!</h4>


				<div style={{padding:'20px'}}>
					<QRCode value={address} />

					<br/>

					{address}

					<div style={{height:'100px'}} />

					<h4>For questions, comments, or feedback find us on social media.</h4>

					<div style={{paddingTop:'20px'}}>
						<SocialIcon url="http://twitter.com/bitcoin_tipping" />
						<SocialIcon url="http://reddit.com/r/BitcoinTipping" />
						<SocialIcon url="https://github.com/acetipper/acetipper" />
					</div>
				</div>
				
			</div>
		);
	}
};

export default Donation;