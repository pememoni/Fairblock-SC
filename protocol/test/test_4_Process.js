var HelloWorld = artifacts.require('HelloWorld');
var Commit = artifacts.require('Commit');
var Participate = artifacts.require('Participate');
var Process = artifacts.require('Process');


contract('Process Async', function(accounts) {
    it('Demo for 1', async function() {


        let CommitContract = await Commit.deployed();
        let ParticipateContract = await Participate.deployed();
        let ProcessContract = await Process.deployed();

        await ProcessContract.deposit({from: accounts[4],value: 20e18});
        // Three participators, accounts 5, 6, 7
        await ParticipateContract.join({from: accounts[5],value: 11e18});
        await ParticipateContract.join({from: accounts[6],value: 11e18});
        await ParticipateContract.join({from: accounts[7],value: 11e18});

        // account 4 as user sending the encrypted transaction for say hello.
        // Seems explained a lot about transaction (NOTE)
        // https://medium.com/@codetractio/inside-an-ethereum-transaction-fa94ffca912f

        // This TX structure could be treated as a specific form of information collection in this system
        // We could add field whatever we want such as gas, gas limit or signature, these should matching the info from
        // the commitment contract. Such as owner must match the user's address. This could be checked automatically
        // in process.sol
        var rawTx = {
            data: '0xc0de',
            value: 10,
            FUNC_SELECTOR: "sayHello2(bytes,address)",
            threshold: 100,
            rand: '0x001',
            parameter1: accounts[5]
        };
        let tx = web3.eth.abi.encodeParameters(
            ['bytes', 'uint', 'string','uint','bytes','address'],
            [rawTx.data, rawTx.value, rawTx.FUNC_SELECTOR,rawTx.threshold,rawTx.rand,rawTx.parameter1]
        );
	console.log(tx)
        // And he/she selected a random string.
        let Commitment = web3.utils.soliditySha3(tx) // make the hash commitment of plain text
        let blocknumber = 3000; // pick a future block number
        let EncryptedTx = tx // Then they encrypt this ......

        // then make a commitment
        await CommitContract.makeCommitment(EncryptedTx, Commitment, blocknumber, {from: accounts[4], value: 1e18});
        // Decrypters in the system should be able to decrypt them
        let DecryptedTx = tx
        // execution
        await ProcessContract.executeTX(
            blocknumber, 0, // This is the index of commitment in Commit.sol
            DecryptedTx, accounts[4], {from: accounts[5]});
    });

    it('Demo for 5', async function() {
        let CommitContract = await Commit.deployed();
        let ProcessContract = await Process.deployed();
        let blocknumber = 4000; // pick a future block number
        await ProcessContract.deposit({from: accounts[7],value: 20e18});
        var rawTx1 = {
            data: '0xc0de',
            value: 1,
            FUNC_SELECTOR: "sayHello(bytes,address)",
            threshold: 100,
            rand: '0x001',
            parameter1: accounts[1]
        };
        var rawTx2 = {
            data: '0xc0de',
            value: 1,
            FUNC_SELECTOR: "sayHello(bytes,address)",
            threshold: 100,
            rand: '0x001',
            parameter1: accounts[2]
        };
        var rawTx3 = {
            data: '0xc0de',
            value: 1,
            FUNC_SELECTOR: "sayHello(bytes,address)",
            threshold: 100,
            rand: '0x001',
            parameter1: accounts[3]
        };
        var rawTx4 = {
            data: '0xc0de',
            value: 1,
            FUNC_SELECTOR: "sayHello(bytes,address)",
            threshold: 100,
            rand: '0x001',
            parameter1: accounts[4]
        };
        var rawTx5 = {
            data: '0xc0de',
            value: 1,
            FUNC_SELECTOR: "sayHello(bytes,address)",
            threshold: 100,
            rand: '0x001',
            parameter1: accounts[5]
        };
        let tx1 = web3.eth.abi.encodeParameters(
            ['bytes', 'uint', 'string','uint','bytes','address'],
            [rawTx1.data, rawTx1.value, rawTx1.FUNC_SELECTOR,rawTx1.threshold,rawTx1.rand,rawTx1.parameter1]
        );
        let tx2 = web3.eth.abi.encodeParameters(
            ['bytes', 'uint', 'string','uint','bytes','address'],
            [rawTx2.data, rawTx2.value, rawTx2.FUNC_SELECTOR,rawTx2.threshold,rawTx2.rand,rawTx2.parameter1]
        );
        let tx3 = web3.eth.abi.encodeParameters(
            ['bytes', 'uint', 'string','uint','bytes','address'],
            [rawTx3.data, rawTx3.value, rawTx3.FUNC_SELECTOR,rawTx3.threshold,rawTx3.rand,rawTx3.parameter1]
        );
        let tx4 = web3.eth.abi.encodeParameters(
            ['bytes', 'uint', 'string','uint','bytes','address'],
            [rawTx4.data, rawTx4.value, rawTx4.FUNC_SELECTOR,rawTx4.threshold,rawTx4.rand,rawTx4.parameter1]
        );
        let tx5 = web3.eth.abi.encodeParameters(
            ['bytes', 'uint', 'string','uint','bytes','address'],
            [rawTx5.data, rawTx5.value, rawTx5.FUNC_SELECTOR,rawTx5.threshold,rawTx5.rand,rawTx5.parameter1]
        );
        let Commitment1 = web3.utils.soliditySha3(tx1) // make the hash commitment of plain text
        await CommitContract.makeCommitment(tx1, Commitment1, blocknumber, {from: accounts[7], value: 1e18});
        let Commitment2 = web3.utils.soliditySha3(tx2) // make the hash commitment of plain text
        await CommitContract.makeCommitment(tx2, Commitment2, blocknumber, {from: accounts[7], value: 1e18});
        let Commitment3 = web3.utils.soliditySha3(tx3) // make the hash commitment of plain text
        await CommitContract.makeCommitment(tx3, Commitment3, blocknumber, {from: accounts[7], value: 1e18});
        let Commitment4 = web3.utils.soliditySha3(tx4) // make the hash commitment of plain text
        await CommitContract.makeCommitment(tx4, Commitment4, blocknumber, {from: accounts[7], value: 1e18});
        let Commitment5 = web3.utils.soliditySha3(tx5) // make the hash commitment of plain text
        await CommitContract.makeCommitment(tx5, Commitment5, blocknumber, {from: accounts[7], value: 1e18});

        // execution
        let indexes = [0,1,2,3,4] // indexes wants to process
        let transactions = [tx1, tx2, tx3, tx4, tx5] // information list
        let owners = [accounts[7], accounts[7], accounts[7], accounts[7], accounts[7]]
        await ProcessContract.batchExecuteTX(
            blocknumber, indexes, // This is the index of commitment in Commit.sol
            transactions, owners, {from: accounts[5]});
    });

    //============================Unit Testing=========================
    it('Invalid cases', async function() {
        let CommitContract = await Commit.deployed();
        let ProcessContract = await Process.deployed();

        var rawTx = {
            data: '0xc0de',
            value: 1000,
            FUNC_SELECTOR: "sayHello(bytes,address)",
            threshold: 100,
            rand: '0x001',
            parameter1: accounts[5]
        };
        let tx = web3.eth.abi.encodeParameters(
            ['bytes', 'uint', 'string','uint','bytes','address'],
            [rawTx.data, rawTx.value, rawTx.FUNC_SELECTOR,rawTx.threshold,rawTx.rand,rawTx.parameter1]
        );
        let Commitment = web3.utils.soliditySha3(tx)
        let blocknumber = 3000;
        let EncryptedTx = tx // for testing process.sol, doesn't encrypt at all.
        // then make a commitment
        await CommitContract.makeCommitment(EncryptedTx, Commitment, blocknumber, {from: accounts[5], value: 1e18});
        // and decrypted immediately for unit testing
        let DecryptedTx = tx
        // execution
        let err = null
        try {
            // not participator
            await ProcessContract.executeTX(blocknumber, 1, DecryptedTx, accounts[5], {from: accounts[4]});
        } catch (error) {
            err = error
        }
        assert.ok(err instanceof Error)
        err = null
        try {
            // index out of range
            await ProcessContract.executeTX(blocknumber, 2, DecryptedTx,accounts[5], {from: accounts[5]});
        } catch (error) {
            err = error
        }
        assert.ok(err instanceof Error)
        err = null
        try {
            // already processed
            await ProcessContract.executeTX(blocknumber, 0, DecryptedTx, accounts[5], {from: accounts[6]});
        } catch (error) {
            err = error
        }
        assert.ok(err instanceof Error)
    });
    it('Commitment was wrong from sender', async function() {
        let CommitContract = await Commit.deployed();
        let ProcessContract = await Process.deployed();

        var rawTx = {
            data: '0xc0de',
            value: 1000,
            FUNC_SELECTOR: "sayHello(bytes,address)",
            threshold: 100,
            rand: '0x001',
            parameter1: accounts[5]
        };
        let tx = web3.eth.abi.encodeParameters(
            ['bytes', 'uint', 'string','uint','bytes','address'],
            [rawTx.data, rawTx.value, rawTx.FUNC_SELECTOR,rawTx.threshold,rawTx.rand,rawTx.parameter1]
        );
        // And he/she selected a random string.
        let Commitment = web3.utils.soliditySha3('it is just random');
        let blocknumber = 3001;
        let EncryptedTx = tx // for testing process.sol, doesn't encrypt at all.
        // then make a commitment
        await CommitContract.makeCommitment(EncryptedTx, Commitment, blocknumber, {from: accounts[4], value: 1e18});
        // and decrypted immediately for unit testing
        let DecryptedTx = tx
        // execution
        await ProcessContract.executeTX(blocknumber, 0, DecryptedTx, accounts[4], {from: accounts[5]});
    });
});
