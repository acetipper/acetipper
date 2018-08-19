var BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;

const BCH = {

	initialize: function() {

		console.log('Initializing BCH');

		BCH.BITBOX = new BITBOXCli();

		var seed = localStorage.getItem('seed');

		if (!seed) {
		  seed = BCH.BITBOX.Mnemonic.generate(256);
		  localStorage.setItem('seed', seed);
		}

		BCH.mneumonic = seed;

		let rootSeed = BCH.BITBOX.Mnemonic.toSeed(BCH.mneumonic);
		let masterHDNode = BCH.BITBOX.HDNode.fromSeed(rootSeed, 'bitcoincash');

		BCH.account = BCH.BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");
	},

	getAddressAndWif: function(index) {
		var node = BCH.BITBOX.HDNode.derivePath(BCH.account, "0/" + index);

		var wif = BCH.BITBOX.HDNode.toWIF(node);
		var address = BCH.BITBOX.HDNode.toCashAddress(node);

		return {address, wif}
	}
};


export default BCH;