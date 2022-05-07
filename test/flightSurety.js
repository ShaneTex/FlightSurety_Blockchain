
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');
const timestamp = Math.floor(Date.now() / 1000);


contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");

  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");

  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {

    // ARRANGE
    let newAirline = accounts[2];
    let newAirline2 = accounts[3];
    let newAirline3 = accounts[4];
    let newAirline4 = accounts[5];
    let newAirline5 = accounts[6];
    let newAirline6 = accounts[7];

      //console.log("self.firstAirline", config.firstAirline)
      //console.log("payload", newAirline)


    // ACT
    try {
        await config.flightSuretyApp.registerAirline(newAirline,
            "Cool your Jets", {
            from: config.firstAirline,
            "gas": 4712388,
            "gasPrice": 100000000000});

        await config.flightSuretyApp.registerAirline(newAirline2,
            "Angel Wings", {
                from: config.firstAirline,
                "gas": 4712388,
                //"value": 1 * config.weiMultiple,
                "gasPrice": 100000000000});

        await config.flightSuretyApp.registerAirline(newAirline3,
            "Fly Boys", {
                from: config.firstAirline,
                "gas": 4712388,
                //"value": 5 * config.weiMultiple,
                "gasPrice": 100000000000});

        await config.flightSuretyApp.registerAirline(newAirline5,
            "Top Gun", {
                from: config.firstAirline,
                "gas": 4712388,
                //"value": 10, //* config.weiMultiple,
                "gasPrice": 100000000000});

        await config.flightSuretyApp.registerAirline(newAirline6,
            "Sky Hook", {
                from: config.firstAirline,
                "gas": 4712388,
                //"value": 10, //* config.weiMultiple,
                "gasPrice": 100000000000});
    }
    catch(e) {
        console.log("error", e.message)
    }
    let result = await config.flightSuretyData.isAirline.call(newAirline);

    // ASSERT
    assert.equal(result, true, "Airline should not be able to register another airline if it hasn't provided funding");

      let count = await config.flightSuretyApp.getAirlineCount.call();
      assert.equal(count, 5, "Should have this number of airlines");

      let airline3Registered = await config.flightSuretyData.isAirlineRegistered.call(newAirline3);
      assert.equal(airline3Registered, true, "Should be registered");

      let airline6Registered = await config.flightSuretyData.isAirlineRegistered.call(newAirline6);
      assert.equal(airline6Registered, false, "Shouldn't be registered");

      //let airByIndex = await config.flightSuretyApp.getAirlineByIndex.call(0);
      //.equal(airByIndex, 1, "Should have this number of airlines");

  });

  it(`(airline funder) verify only funded airlines can participate`, async function () {

      let newAirline = accounts[2];
      let newAirline2 = accounts[3];
      let newAirline3 = accounts[4];
      let newAirline4 = accounts[5];

      const etherValue = 10 * config.weiMultiple;
      //console.log(etherValue)

      let pay = await config.flightSuretyApp.payFunding.sendTransaction({
          from: newAirline,
          "gas": 4712388,
          "value": 10 * config.weiMultiple,
          "gasPrice": 100000000000});

      //console.log(pay)

      let airlineFunded = await config.flightSuretyData.isAirlineFunded.call(newAirline);
      assert.equal(airlineFunded, true, "New airline should be valid");


      let pay2 = await config.flightSuretyApp.payFunding.sendTransaction({
          from: newAirline2,
          "gas": 4712388,
          "value": 10 * config.weiMultiple,
          "gasPrice": 100000000000});

      //console.log(pay2)

      let airline2Funded = await config.flightSuretyData.isAirlineFunded.call(newAirline);

      assert.equal(airline2Funded, true, "2nd New airline should be valid");

  });


    it(`(airline vote) vote for airlines register`, async function () {

        let newAirline = accounts[2];
        let newAirline2 = accounts[3];
        let newAirline3 = accounts[4];
        let newAirline4 = accounts[5];
        let newAirline5 = accounts[6];
        let newAirline6 = accounts[7];
        let notAnAirline = accounts[8];


        let vote1 = await config.flightSuretyApp.voteToRegisterAirline(newAirline5,
             {
                from: config.firstAirline,
                "gas": 4712388,
                //"value": 10, //* config.weiMultiple,
                "gasPrice": 100000000000});

        let vote2 = await config.flightSuretyApp.voteToRegisterAirline(newAirline5,
             {
                from: newAirline2,
                "gas": 4712388,
                //"value": 10, //!* config.weiMultiple,
                "gasPrice": 100000000000});

        let vote3 = await config.flightSuretyApp.voteToRegisterAirline(newAirline5,
             {
                from: newAirline3,
                "gas": 4712388,
                //"value": 10, //!* config.weiMultiple,
                "gasPrice": 100000000000});

        let vote4 = await config.flightSuretyApp.voteToRegisterAirline(newAirline5,
             {
                from: newAirline,
                "gas": 4712388,
                //"value": 10, //!* config.weiMultiple,
                "gasPrice": 100000000000});

        //console.log(vote1)

        let airline5Registered = await config.flightSuretyData.isAirlineRegistered.call(newAirline5);
        console.log(airline5Registered)
        assert.equal(airline5Registered, true, "Should be registered");

        let count = await config.flightSuretyApp.getAirlineCount.call();
        console.log(count)
        //assert.equal(vote1, false, "shouldnt register");

      /*  let vote2 = await config.flightSuretyApp.voteToRegisterAirline(newAirline6,
            "Sky Hook", {
                from: notAnAirline,
                "gas": 4712388,
                //"value": 10, //!* config.weiMultiple,
                "gasPrice": 100000000000});

        assert.equal(vote1[0], false, "shouldnt register");*/

/*

        let pay = await config.flightSuretyApp.payFunding.sendTransaction({
            from: newAirline,
            "gas": 4712388,
            "value": 10 * config.weiMultiple,
            "gasPrice": 100000000000});

        console.log(pay)

        let airlineFunded = await config.flightSuretyData.isAirlineFunded.call(newAirline);
        assert.equal(airlineFunded, true, "New airline should be valid");
*/


    });


    it('(flights) check flights can be created', async () => {

        // ARRANGE
        let newAirline = accounts[2];
        let newAirline2 = accounts[3];
        let newAirline3 = accounts[4];
        let newAirline4 = accounts[5];

        //console.log("self.firstAirline", config.firstAirline)
        //console.log("payload", newAirline)


        // ACT
        try {
            await config.flightSuretyApp.registerFlight(newAirline,
                "SH1022", timestamp,{
                    from: config.firstAirline,
                    "gas": 4712388,
                    "gasPrice": 100000000000});

            /*await config.flightSuretyApp.registerAirline(newAirline2,
                "Angel Wings", {
                    from: config.firstAirline,
                    "gas": 4712388,
                    //"value": 1 * config.weiMultiple,
                    "gasPrice": 100000000000});

            await config.flightSuretyApp.registerAirline(newAirline3,
                "Fly Boys", {
                    from: config.firstAirline,
                    "gas": 4712388,
                    //"value": 5 * config.weiMultiple,
                    "gasPrice": 100000000000});

            await config.flightSuretyApp.registerAirline(newAirline4,
                "Fly Boys", {
                    from: config.firstAirline,
                    "gas": 4712388,
                    //"value": 10, //!* config.weiMultiple,
                    "gasPrice": 100000000000});*/
        }
        catch(e) {
            console.log("error", e.message)
        }

        let result = await config.flightSuretyData.isAirline.call(newAirline);

        // ASSERT
        //assert.equal(result, true, "Airline should not be able to register another airline if it hasn't provided funding");

        let count = await config.flightSuretyApp.getAirlineCount.call();
        assert.equal(count, 6, "Should have this number of airlines");

        //let airByIndex = await config.flightSuretyApp.getAirlineByIndex.call(0);
        //.equal(airByIndex, 1, "Should have this number of airlines");

    });


    it('(flights) check flights can purchase insurance', async () => {

        let newAirline = accounts[2];

        const etherValue = .5 * config.weiMultiple;
        //console.log(etherValue)
        let payload = {
            flight: "SH1022",
            addr: newAirline,
            passenger: config.firstPassenger,
            amount: .5 * config.weiMultiple,
            timestamp: timestamp //Math.floor(Date.now() / 1000)
        }

        let pay = await config.flightSuretyApp.buy.sendTransaction(payload.addr,
            payload.flight,
            payload.timestamp,
            payload.passenger,
            {from: newAirline,
            "gas": 4712388,
            "value": etherValue,
            "gasPrice": 100000000000});

        console.log(pay)

        //assert.equal(pay, 2, "Insurance should be valid");

    });



});
