var HelloWorld = artifacts.require('HelloWorld');
var Commit = artifacts.require('Commit');
var Participate = artifacts.require('Participate');
var Process = artifacts.require('Process');

module.exports = function(deployer) {
    deployer.deploy(Process,Commit.address, Participate.address, HelloWorld.address);
};