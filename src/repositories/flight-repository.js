const CrudRepository = require("./crud-repository");
const { Flight } = require("../models");

class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight); //call constru of parent class
  }

  async getAllFlights(filter){
    const response = await Flight.findALl({
      where: {
        
      }
    })
    return response;
  }
}

module.exports = FlightRepository;
