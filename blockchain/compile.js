import fs from "fs";
import solc from "solc";
import path from "path";

const contractPath = path.resolve("ProductRegistry.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "ProductRegistry.sol": { content: source }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"]
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));


if (output.errors) {
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
  });
  throw new Error("Compilation failed");
}
const contract = output.contracts["ProductRegistry.sol"]["ProductRegistry"];
fs.writeFileSync("ProductRegistryABI.json", JSON.stringify(contract.abi, null, 2));
fs.writeFileSync("ProductRegistryBytecode.json", contract.evm.bytecode.object);

console.log("✅ Contract compiled successfully!");
