// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// This is a simple contract that keeps calling order
contract HelloWorld {
    uint order;
    uint order2;
    event Hello(address _from, address _to, uint order);
    event Hello2(address _from, address _to, uint order);
    event ValueReceived(address, uint);
    constructor() public {
        order = 1;
        order2 = 1;
        // TODO add a trust method if not 1-1

  }
    function() external payable {
        emit ValueReceived(msg.sender, msg.value);
    }

    function sayHello(bytes memory transaction, address owner) public {
        TX memory aTX = _decode(transaction);
        emit Hello(owner, aTX.parameter1, order);
        order += 1;
    }

    function sayHello2(bytes memory transaction, address owner) public {
        TX memory aTX = _decode(transaction);
        emit Hello2(owner, aTX.parameter1, order2);
        order2 += 1;
    }


    // every target contract should have a transaction structure
    struct TX {
        bytes data; // additional data left for messages
        uint value; // Number of Wei
        string FUNC_SELECTOR; // Which function to call
        uint threshold; // waiting to be executed, 0 completely prevent front running
        bytes rand; // randomness for ordering

        address parameter1; // Say hello to
    }

    function _decode(bytes memory transaction) internal returns (TX memory) {
        bytes memory data;
        uint value;
        string memory FUNC_SELECTOR;
        uint threshold;
        bytes memory rand;

        address parameter1;

        (data, value, FUNC_SELECTOR, threshold, rand, parameter1) = abi.decode(transaction, (bytes, uint, string,uint,bytes, address));
        return TX(data, value, FUNC_SELECTOR,threshold, rand, parameter1);
    }
}
