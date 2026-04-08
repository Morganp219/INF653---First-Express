const { logMW, logEvents } = require("./log")

function onError(err, req, res, next) {
    try {
        logMW(req, res, next)
        res.status(err.status || 500).json({ error: err.message })
        logEvents(err.message)
        console.error(err.message)
    } catch (error) {
        console.error('Error in error handler:', error)
        console.error(error.message)
        logEvents(error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}
module.exports = { onError }