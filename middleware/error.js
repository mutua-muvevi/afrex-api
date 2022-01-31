const ErrorResponse = require("../utils/errorResponse")

const errorsHandler = (err, req, res, next) => {
	let error = {...err}
	error.message = err.message

	// handling duplication error
	if (err.code === 11000){
		const message = "Duplication Error"
		error = new ErrorResponse(message, 400)
	}

	// handling validation error
	if (err.name === "ValidationError"){
		const message = Object.values(err.errors).map(val => val.message)
		error = new ErrorResponse(message, 400)
	}

	// res returns
	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Internal Server Error"
	})
}

module.exports = errorsHandler