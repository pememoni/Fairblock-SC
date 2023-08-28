# Fairblock: Preventing De-Fi Front-running Attacks using Identity-Based Encryption

This repo has been developed during my academic publications in grad school, for recent developments of Fairblock (as a start-up) please check [here](https://github.com/fairblock)

While blockchain systems are quickly gaining popularity, front-running remains a major obstacle to fair exchange. In this paper, we show how to apply Identity-Based Encryption (IBE) to prevent front-running with minimal bandwidth overheads. 
In our approach, to decrypt a block of N transaction, the number of messages sent across the network only grows linearly with the size of decrypting committees, S. That is, to decrypt a set of N transactions sequenced at a specific block, a committee only needs to exchange $S$ decryption shares (independent of N). In comparison, previous solutions based on the threshold encryption schemes, where each transaction in a block must be decrypted separately by the committee, resulting in bandwidth overhead of N * S.

## How does Fairblock work?
![flow](https://user-images.githubusercontent.com/34263018/148458698-80357c64-575e-44d9-892d-28ab77a2856a.png)

In FairBlock, a committee named "keepers" run a DKG protocol to generate a shared master key associated with a system-wide master public key for an IBE scheme.
Next, we associate each block or range of blocks with an IBE "identity". Consequently, clients can commit to their transactions by encrypting their information with master public key and an identity for a future block h (or a range of blocks). Validators run the consensus and sequence all encrypted transactions in a block. Finally, to decrypt the block with minimal overheads, each keeper (a) computes a share of the private key for the IBE identity corresponding to block identifer h, and (b) broadcasts it over the blockchain. 
After sufficiently many keepers propagated their shares, anyone can perform the key reconstruction process to obtain the private key
that allows decryption of all transactions encrypted under identity "h" with no further communication. In FairBlock, another set combined of users, clients, or validators named "relayers" (which can be overlapping with keepers) are responsible for key reconstruction and decryption.  


[Intro video](https://www.youtube.com/watch?v=LCCsw-aTdl0&list=PLXckXtNUcFBVc-ut9E74pGiDW-yEfnXX-&index=3)

## Description

`protocol` contains protocols for user participation, on-chain communication, Incentivization implemented in Solidity smart contracts

`encryption` contains the Go code for Identity-Based Encryption and Threshold Decryption. This is built upon the IBE implementation of `vuvuzela/crypto`.

## Instruction for running tests

### Protocol

1. `cd protocol`

2. `truffle compile`

3. open Ganache, make sure what in the `truffle-config.js` matches with Ganache

4. `truffle  migrate`

5. `truffle test --show-events` or `truffle test`

### Encryption

1. `cd distributedIBE/ibe`

2. `go test`

* This project has been built based on Vuvuzela and tcpaillier projects
* This implementation has not been vetted for a production setting, use with caution
* This project has been tested on Linux
