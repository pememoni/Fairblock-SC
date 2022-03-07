var Participate = artifacts.require('Participate');

contract('Participate Async', function(accounts) {




    it('Demo', async function() {
        let contract = await Participate.deployed();


        // account 7 joins the keyper group, pays 11 ether, which is higher than entry fee
        await contract.join({from: accounts[7],value: 11e18});
        let CheckIfIn_afterJoin = await contract.contains.call(accounts[7]);
        assert.equal(true, CheckIfIn_afterJoin);

        // account 7 leaves the keyper group
        await contract.leave({from: accounts[7]});
        let CheckIfIn_afterLeave = await contract.contains.call(accounts[7]);
        assert.equal(false, CheckIfIn_afterLeave);
    });



    // ===========================Unit testing============================
    it('Without signup, returns false', async function() {
        let contract = await Participate.deployed();
        let CheckIfIn = await contract.contains.call(accounts[1]);
        assert.equal(false, CheckIfIn);
    });
    it('After signup, returns true', async function() {
        let contract = await Participate.deployed();
        // call join function
        let balance = await web3.eth.getBalance(accounts[1]);
        console.log("Account1 balance: " + web3.utils.fromWei(balance, "ether") + " ETH");
        await contract.join({from: accounts[1],value: 11e18});
        let balance2 = await web3.eth.getBalance(accounts[1]);
        console.log("Account1 balance: " + web3.utils.fromWei(balance2, "ether") + " ETH");
        let CheckIfIn = await contract.contains.call(accounts[1]);
        assert.equal(true, CheckIfIn);
    });
    it('Reject double joining', async function() {
        let contract = await Participate.deployed();
        let err = null
        try {
            await contract.join({from: accounts[1],value: 11e18});
        } catch (error) {
            err = error
        }
        assert.ok(err instanceof Error)
        let CheckIfIn = await contract.contains.call(accounts[1]);
        assert.equal(true, CheckIfIn);
    });
    it('After leave, return false', async function() {
        let contract = await Participate.deployed();
        await contract.leave({from: accounts[1]});
        let CheckIfIn = await contract.contains.call(accounts[1]);
        assert.equal(false, CheckIfIn);
    });
    it('Sign up but not enough money, returns false', async function() {
        let contract = await Participate.deployed();
        let err = null
        try {
            await contract.join({from: accounts[2],value: 9e18});
        } catch (error) {
            err = error
        }
        assert.ok(err instanceof Error)
        let CheckIfIn = await contract.contains.call(accounts[2]);
        assert.equal(false, CheckIfIn);
    });
    it('Not in but call leave', async function() {
        let contract = await Participate.deployed();
        let err = null
        try {
            await contract.leave({from: accounts[2]});
        } catch (error) {
            err = error
        }
        assert.ok(err instanceof Error)
    });
});