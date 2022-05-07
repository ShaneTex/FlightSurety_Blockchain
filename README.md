# FlightSurety - Shane Nicoll Project

FlightSurety is a sample application project for Udacity's Blockchain course.

## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.

To install:
1. download or clone the repo
2. verify info in truffle.js file to make sure mnemonic is set up correctly
3. Start Up Ganache
4. Take note of index 1 address
5. Update firstAirline address in migrations/2_deploy_contracts with that address, then:

`npm install`
`truffle compile`
`truffle migrate --reset`

## Pertinent Contents
- [contracts](build/contracts)
    - FlightSuretyApp.sol
    - FlightSuretyData.sol
- [test](Tests for contracts)
    - flightSurety.js
    - oracles.js
- [app](gui to test dapp)
    - dapp/index.html

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`
`truffle test ./test/oracles.js`

To use the dapp:

`truffle migrate`
`npm run dapp`
7.17.6 (@babel/core 7.17.5)


To view dapp:

`http://localhost:8000`

To test dapp(steps):
1. view dapp
2. Walk down the process of creating new airlines
3. make sure and fund them as you go so you don't have to go back a step once you walk down the website
4. if you create more that 4 airlines, then you will need to vote on the new ones, the vote dropdown will be blank until you get 5 or more
5. Continue down the site
6. Once you get to step 3 keep clicking the Flight status for the flight in question to be Late
7. Step 4, the Claim Flight Insurance button just tests to see if it was late.
8. continue to withdraw.

## Develop Server

`npm run server`
`truffle test ./test/oracles.js`

## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder


## Resources

* [WebStorm](https://www.jetbrains.com/webstorm/)
* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)
