pragma solidity ^0.4.17;

contract Adoption {

	// public variables have automatic getters and setters
	// However an arrays getter is a key
	address[16] public adopters;
	

	function adopt (uint petId) public returns (uint) {
		require(petId >=0 && petId <=15);
		adopters [petId] = msg.sender;
		return petId;
	}
	
	function getAdopters() public view returns (address[16]) {
		return adopters;
	}

}