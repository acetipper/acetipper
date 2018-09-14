import React, { Component } from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap/lib';
import TxList from './TxList';
import SeedList from './SeedList';
import Donation from './Donation';
import ImportSeedList from './ImportSeedList';
import BCH from './bch';
import {HashRouter, Route } from "react-router-dom";
import './App.css';
import {store} from './store';
import {axn_newTip, axn_setUsdBch} from './actions';
import Currency from 'react-currency-formatter';

class App extends Component {

    constructor(props) {

        super(props);

        BCH.initialize();

        fetch('https://api.coinbase.com/v2/exchange-rates?currency=BCH')
          .then(function(response) {
                return response.json();
            })
          .then(function(json) {

                var usd = parseFloat(json.data.rates.USD);

                store.dispatch(axn_setUsdBch(usd));

                // get the first transaction in
                store.dispatch(axn_newTip());              
          });
    }
    
    render() {

        return (
            <div className="App">

                <Navbar>
                  <Navbar.Header>
                    <Navbar.Brand>
                      <a href="#/txs">Ace Tipper!</a>
                    </Navbar.Brand>
                  </Navbar.Header>
                  <Nav>
                    <NavItem href="#/txs">
                      Transactions
                    </NavItem>

                    <NavItem href="#/txs">
                      BCH = <Currency quantity={store.getState().USD_BCH} currency="USD" /> USD
                    </NavItem>

                    <NavItem href="#/seed">
                      [Seed List]
                    </NavItem>

                    <NavItem href="#/import">
                      [Import Seed List]
                    </NavItem>

                    <NavItem href="#/donate">
                      Donate / Contacts
                    </NavItem>

                  </Nav>
                </Navbar>

                <HashRouter>
                    <div className='App-content'>
                        <Route exact path="/" component={TxList} />
                        <Route exact path="/txs" component={TxList} />
                        <Route exact path="/seed" component={SeedList} />
                        <Route exact path="/donate" component={Donation} />
                        <Route exact path="/import" component={ImportSeedList} />
                    </div>
                </HashRouter>
            </div>
        );
    }
}

export default App;

