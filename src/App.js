import React, { Component } from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap/lib';
import TxList from './TxList';
import SeedList from './SeedList';
import Donation from './Donation';
import BCH from './bch';
import { BrowserRouter as Router, Route } from "react-router-dom";
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
                      <a href="/">Ace Tipper! (alpha)</a>
                    </Navbar.Brand>
                  </Navbar.Header>
                  <Nav>
                    <NavItem href="/txs">
                      Transactions
                    </NavItem>
                    <NavItem href="/seed">
                      Seed List
                    </NavItem>

                    <NavItem href="/txs">
                      BCH = <Currency quantity={store.getState().USD_BCH} currency="USD" /> USD
                    </NavItem>

                    <NavItem href="/donate">
                      Donate / Contact
                    </NavItem>
                  </Nav>
                </Navbar>

                <Router>
                    <div className='App-content'>
                        <Route exact path="/" component={TxList} />
                        <Route exact path="/txs" component={TxList} />
                        <Route exact path="/seed" component={SeedList} />
                        <Route exact path="/donate" component={Donation} />
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
