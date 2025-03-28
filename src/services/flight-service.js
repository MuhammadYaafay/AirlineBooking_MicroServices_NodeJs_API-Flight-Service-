// controllers pass call on services which use reposit to get data from db
// services are business logic
const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const { FlightRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { compareTime } = require("../utils/helpers/datetime-helpers")

const flightRepository = new FlightRepository();

async function createFlight(data) {
    try {
        if (!compareTime(data.departureTime, data.arrivalTime)) {
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

async function getAllFlights(query) {
    let customFilter = {};
    let sortFilter = [];
    const endingTripTime = "23:59:00"
    //tripes=KHI-ISL

    if (query.trips) {
        [departureAirportId, arrivalAirportId] = query.trips.split("-");
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId;
        //add a check that they are not same
    }
    if (query.price) {
        [minPrice, maxPrice] = query.price.split("-")
        customFilter.price = {
            [Op.between]: [minPrice, (maxPrice == undefined) ? 20000 : maxPrice]
        }
    }
    if (query.travellers) {
        customFilter.totalSeats = {
            [Op.gte]: query.travellers
        }
    }
    if (query.tripDate) {
        customFilter.departureTime = {
            [Op.between]: [query.tripDate, query.tripDate + endingTripTime]
        }
    }
    if(query.sort){
        const params = query.sort.split(',') 
        const sortFilters = params.map((param)=>{
            param.split("_")
        })
        sortFilter =  sortFilters
    }
    try {
        const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    } catch (err) {
        throw new AppError(
            "cannot fetch data of all the flights",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    createFlight,
    getAllFlights,
};
