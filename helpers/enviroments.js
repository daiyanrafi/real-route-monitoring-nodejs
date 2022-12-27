// dependencies

// module scaffoldings
const enviroments = {};

enviroments.staging = {
    port: 3000,
    evnName: 'staging',
    secretKey: 'fhouhfoshfosahjfs',
};

enviroments.production = {
    port: 5000,
    evnName: 'staging',
    secretKey: 'rwetgrhfavafasdfss',
};

// determine which env passed
const currentEnviroment =    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export env obj
const enviromentToExport =    typeof enviroments[currentEnviroment] === 'object'
        ? enviroments[currentEnviroment]
        : enviroments.staging;

// export
module.exports = enviromentToExport;
