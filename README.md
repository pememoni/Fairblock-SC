# Frunliner: Preventing De-Fi Front-running Attacks using Identity-Based Encryption and DKG
Fruntliner is the frontliner worker to fight frontrunning attacks!
Front-running  attacks  have  been  a  major  concern  in blockchain-based  applications. MEV is  defined  as  the  revenue  that  miners  also  known  as validators extract by front-running attacks which can be reordering,  censoring,  and adding transactions. Researchers has been reporting shocking statistics about MEV revenues. Everyday,  sophisticated bots and their affiliated miners are  making  between  $1  million  to  $5  million  with  the total amount of over $707.4 million to the date. These  type  of  attacks lead to  failure  of  transactions,  increase  and  waste  of fees,  and  occupation  of  network  capacity.   This project is an efficient  and  realistic  protocol for preventing Front-running Attacks based  on  identity-based encryption and distributed key generation.

[Intro video](https://www.youtube.com/watch?v=LCCsw-aTdl0&list=PLXckXtNUcFBVc-ut9E74pGiDW-yEfnXX-&index=3)

## Description

`protocol` contains protocols for user participation, on-chain communication, Incentivization implemented in Solidity smart contracts

`encryption` contains the Golang code for Identity-based encryption and threshold decryption. This is built upon the IBE implementation of `vuvuzela/crypto`.

## Instruction for running tests

### Protocol

1. `cd protocol`

2. `truffle compile`

3. open Ganache, make sure what in the `truffle-config.js` matches with Ganache

4. `truffle  migrate`

5. `truffle test --show-events` or `truffle test`

### Encryption

1. `cd encryption/IBEcrypto`

2. `go test`

## Useful Resources

[ETHDKG implementation](https://github.com/PhilippSchindler/ethdkg/)

[Ferveo for VSS on the public chain](https://anoma.network/blog/ferveo-a-distributed-key-generation-scheme-for-front-running-protection/)

