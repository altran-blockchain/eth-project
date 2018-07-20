pragma solidity ^0.4.17;


// Global truffle directory imports
import "truffle/Assert.sol";  //gives us asserts
import "truffle/DeployedAddresses.sol"; //address of the deployed contract (for testing)
import "../contracts/Adoption.sol";

contract TestAdoption {
	Adoption adoption = Adoption(DeployedAddresses.Adoption());


	//adopt function defines success if returned id == provided id
	function testUserCanAdoptPet() public {
		uint returnId = adoption.adopt(8);
		uint expected = 8;
		Assert.equal(returnId, expected, "Adoption of pet. ID 8 should be recoreded");
	}

	function testGetAdopterAddressByPetId() public {
		//expected owner is this contract
		address expected = this;
		
		//Access the auto getter of the public variable
		address adopter = adoption.adopters(8);
		
		Assert.equal(adopter, expected, "Owener of pet ID. 8 should be recorded");
	}


	function testGetAdopterAddressByPetIdInArray() public {
	// same test as previous test. however instead of using the getter, we will call the function
	address expected = this;

	// I want to keep this in memory, instead of the contract's storage.
	address [16] memory adopters = adoption.getAdopters();
	Assert.equal(adopters[8], expected, "Owner of pet ID. 8 should be recorded");
	}
}