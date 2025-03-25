// controllers pass call on services which use reposit to get data from db
// services are business logic

const { AirplaneRepository } = require("../repositories");

const airplaneRepository = new AirplaneRepository();

function createAirplane(data) {
  try {
    const airplane = airplaneRepository.create(data);
    return airplane;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createAirplane,
};
