// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Participate {

  // To keep a record of if an address is a valid keyper
  mapping (address => bool) public Relayers;
  uint EntryFee;

  event Join(address _from);
  event Leave(address _from);

  constructor() public payable {
    EntryFee = 10e18; // Same thing as 10 ether
  }


  function join() payable public {
    require(contains(msg.sender) == false, 'already being a participator.'); // not in the list
    require(msg.value >= EntryFee); // enough payment
    Relayers[msg.sender] = true;
    emit Join(msg.sender);
  }

  function leave() public {
    require(contains(msg.sender), 'sender not in the group');
    Relayers[msg.sender] = false;
    emit Leave(msg.sender);
    // TODO; potential reward could be given.
  }

  function contains(address addr) public returns (bool){
    return Relayers[addr];
  }
}
