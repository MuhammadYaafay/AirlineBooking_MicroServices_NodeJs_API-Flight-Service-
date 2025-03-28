// controllers pass call on services which use reposit to get data from db
// services are business logic
const { StatusCodes } = require("http-status-codes");
const { FlightRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const {compareTime} = require("../utils/helpers/datetime-helpers")

const flightRepository = new FlightRepository();

async function createFlight(data) {
    try {
        if(!compareTime(data.departureTime, data.arrivalTime)){
            throw new AppError("Invalid time", StatusCodes.BAD_REQUEST);
        }
        const flight = await flightRepository.create(data);
        return flight;
    } catch (error) {
        if (error.name == "SequelizeValidationError") {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError(
            "cannot create a new flight object",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


module.exports = {
    createFlight
};
