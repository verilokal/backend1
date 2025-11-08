// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductRegistry {
    struct Product {
        uint256 product_id;
        string blockchain_hash;
        address owner;
    }

    mapping(string => Product) private products;
    mapping(string => bool) private hashExists;

    event ProductRegistered(uint256 product_id, string blockchain_hash, address owner);

    function registerProduct(uint256 product_id, string memory blockchain_hash) public {
        require(!hashExists[blockchain_hash], "Product already registered!");

        products[blockchain_hash] = Product({
            product_id: product_id,
            blockchain_hash: blockchain_hash,
            owner: msg.sender
        });

        hashExists[blockchain_hash] = true;

        emit ProductRegistered(product_id, blockchain_hash, msg.sender);
    }
    function verify(string memory blockchain_hash) public view returns (bool exists, uint256 product_id, address owner) {
        if (hashExists[blockchain_hash]) {
            Product memory product = products[blockchain_hash];
            return (true, product.product_id, product.owner);
        } else {
            return (false, 0, address(0));
        }
    }
}
