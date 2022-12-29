// application routes
// dependendies

const { aboutHandler } = require('./handlers/routeHandlers/aboutHandler');
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');

const routes = {
    sample: sampleHandler,
    about: aboutHandler,
    user: userHandler,
    token: tokenHandler,
};

module.exports = routes;
