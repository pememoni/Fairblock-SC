// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract MultiCall {
    struct Transaction {
        address target;
        bytes data;
        uint256 value;
    }

    function multiCall(Transaction[] memory transactions)
        public
        returns (uint256 blockNumber, bytes[] memory returnData)
    {
        blockNumber = block.number;
        returnData = new bytes[](transactions.length);
        for (uint256 i = 0; i < transactions.length; i++) {
            (bool success, bytes memory ret) = transactions[i].target.call(
                transactions[i].data
            );
            require(success);
            returnData[i] = ret;
        }

        return (blockNumber, returnData);
    }
}
