# Front_Running

[ETHDKG implementation](https://github.com/PhilippSchindler/ethdkg/)

[Ferveo for VSS on the public chain](https://anoma.network/blog/ferveo-a-distributed-key-generation-scheme-for-front-running-protection/)

[Intro video](https://www.youtube.com/watch?v=LCCsw-aTdl0&list=PLXckXtNUcFBVc-ut9E74pGiDW-yEfnXX-&index=3)

# Description

`FR` contains solidity smart contracts.

`CryptPart` contains the Golang code for IBE threshold encryption and decryption. This is built upon the IBE implementation of `vuvuzela/crypto`.

# Run tests

## FR

1. `cd FR`

2. `truffle compile`

3. open Ganache, make sure what in the `truffle-config.js` matches with Ganache

4. `truffle  migrate`

5. `truffle test --show-events` or `truffle test`

## CryptPart

1. `cd CryptPart/IBEcrypto`

2. `go test`
