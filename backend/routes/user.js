// Call Express
const express = require("express");
// create a new router object in your program to handle requests.
const router = express.Router();

// import the logic road
const userCtrl = require("../controllers/user");

//intercepts post registration requests
router.post("/signup", userCtrl.signup);
//intercepts authentication post requests
router.post("/login", userCtrl.login);

// export router
module.exports = router;
