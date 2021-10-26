# Frunliner: Preventing De-Fi Front-running Attacks using Identity-Based Encryption and DKG

[Intro video](https://www.youtube.com/watch?v=LCCsw-aTdl0&list=PLXckXtNUcFBVc-ut9E74pGiDW-yEfnXX-&index=3)

# Description

`protocol` contains protocols for user participation, on-chain communication, Incentivization implemented in Solidity smart contracts

`encryption` contains the Golang code for Identity-based encryption and threshold decryption. This is built upon the IBE implementation of `vuvuzela/crypto`.

# Run tests

## Protocol

1. `cd protocol`

2. `truffle compile`

3. open Ganache, make sure what in the `truffle-config.js` matches with Ganache

4. `truffle  migrate`

5. `truffle test --show-events` or `truffle test`

## Encryption

1. `cd encryption/IBEcrypto`

2. `go test`

### Useful Resources

[ETHDKG implementation](https://github.com/PhilippSchindler/ethdkg/)

[Ferveo for VSS on the public chain](https://anoma.network/blog/ferveo-a-distributed-key-generation-scheme-for-front-running-protection/)

