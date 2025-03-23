//for versioning the api v1, v2

const express = require("express");

const { InfoController } = require("../../controllers");

const router = express.Router();

router.get("/info", InfoController.info);

module.exports = router;
