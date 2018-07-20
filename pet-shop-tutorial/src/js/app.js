//Most of this was pre-written
// App is just like a giant dictionary, with each key defining a function
// I will fill it up with fun stuff, as per the tutorial

App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    
    // Are we on an injected web3 instance?
    // Mist or chrome with MetaMask 
    if (typeof web3 != 'undefined')
    {
      App.web3Provider = web3.currentProvider;
    }

    //if no instance is detected, fallback to ganache
    else
    {
      //Ok for test and development, not insecure and not good for production environments
      App.web3Provider = newWeb3.providers.HttpProvider("http://localhost:7545");
    }

    return App.initContract();
  },

  initContract: function() {
    // Need to instantiate smart contract
    // We will make use of truffle-contract library
    // Don'It eeps info about the contract in sync with migrations. 
    // Therfore -> Don't need to change the contract's deployed address manually
        
    $.getJSON('Adoption.json', function(data){
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      // 1. Retrieve the artifact file for our smart contract.
      //    They are info about our contract(deployed address, ABI). ABI -> Application Binary interface
      //    It's a js object which tells us how to interact with the contract 
      //    (variables,functions and their params)
      var AdoptionArtifact = data;
      // Once we have the artifacts, pass them to TruffleContract(..). 
      // It creates an instance of our contract
      app.contracts.Adoption = TruffleContract(AdoptionArtifact);

      //Set the provider for our contract
      // using the previously set provider
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      // in case any pets are already adopted
      // seperated it into a different function
      // why? because UI has to be updated everytime some pet is adopted
      return App.markAdopted();

    });
    

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */

     //Declaring this outside the contract calls
     // can access the instance after initially retrieving it
     var adoptionInstance;

     //access the deployed contract
     App.contracts.Adoption.deployed()
     //call get adopters on this contract . The .then is performed on the previous instance
     .then(function(instance){
              adoptionInstance = instance;
              // using call on the instance, allows us to read data from the blockchain
              // without having to send a transacation
              // Therefore costs no ether.
              return adoptionInstance.getAdopters.call();
     })
     
     // 
     .then(function(adopters){
              for (i = 0; i<adopters.length; i++)
              {                
                // we don't check for null or emptiness
                // this is an empty ethereum address
                if (adopters[i]!== '0x0000000000000000000000000000000000000000')
                {

                  // Found a pet, disable the adopt button and change
                  $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
                }
              }
     })
     
     .catch(function(err){
              console.log(err.message);

     });

  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    // store the contract instance
    var adoptionInstance = instance;

    // Get user's accounts
    web3.eth.getAccounts(function(error, accounts){
      if(error){
        console.log(error)
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance){
        adoptionInstance = instance;
        // different from markadopted. Sending a transaction instead of a call
        // transactions require a from address, and have a "cost". 
        return adoptionInstance.adopt(petId, {from:account});
      }).then(function(result){
        return App.markAdopted();
      }).catch(function(err){
        console.log(err.message);
      });

    });
    

  } // End handleAdopt

}; //End App 

$(function() {
  $(window).load(function() {
    App.init();
  });
});
