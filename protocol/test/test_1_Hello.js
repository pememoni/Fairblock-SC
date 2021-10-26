var HelloWorld = artifacts.require('HelloWorld');

contract('HelloWorld Async', function(accounts) {
    // account 1 says hello
    var rawTx = {
        data: '0xc0de',
        value: 1000,
        FUNC_SELECTOR: "sayHello(bytes,address)",
        threshold: 100,
        rand: '0x001',
        parameter1: accounts[5]
    };
    it('Test target contract', async function() {

        let tx = web3.eth.abi.encodeParameters(
            ['bytes', 'uint', 'string','uint','bytes','address'],
            [rawTx.data, rawTx.value, rawTx.FUNC_SELECTOR,rawTx.threshold,rawTx.rand,rawTx.parameter1]
        );

        let contract = await HelloWorld.deployed();
        await contract.sayHello(tx,accounts[1],{from: accounts[6]});
        console.log('Account 1 says hello to account 5.');
        await contract.sayHello(tx,accounts[3],{from: accounts[6]});
        console.log('Account 3 says hello to account 5.');
        await contract.sayHello2(tx,accounts[2],{from: accounts[6]});
        console.log('Account 2 says hello to account 5.');
    });
});