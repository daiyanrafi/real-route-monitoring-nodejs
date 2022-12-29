// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// modul;e scaffolding

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

// scaffolding

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // user existing checking
        data.read('users', phone, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the user in db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'user created successfull!',
                        });
                    } else {
                        callback(500, { error: 'could not create user' });
                    }
                });
            } else {
                callback(500, {
                    error: 'The user alreary existed.',
                });
            }
        });
    } else {
        callback(400, {
            error: 'you have a problem user',
        });
    }
};

handler._users.get = (requestProperties, callback) => {
    // check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        // //verify user
        // let token = typeof(requestProperties.headersObject.token) === 'string' ?
        // requestProperties.headersObject.token : false;
        
        // tokenHandler._token.verify(token, phone, (tokenId) => {
        //     if(tokenId) {
        //         //verify ended ^
                  // lookup the user
        data.read('users', phone, (err, u) => {
            const user = { ...parseJSON(u) };
            if (!err && user) {
                delete user.password;
                callback(200, user);
            } else {
                callback(404, {
                    error: 'Requested user was not found!',
                });
            }
        });
        /// lookup ended ^
        //     }else {
        //         callback(403, {
        //             error: 'authentication failed',
        //         });
        //     }
        // });


    } else {
        callback(404, {
            error: 'Requested user was not found!',
        });
    }
};

handler._users.put = (requestProperties, callback) => {
     // check phone number if valid
     const phone =
     typeof requestProperties.body.phone === 'string' &&
     requestProperties.body.phone.trim().length === 11
         ? requestProperties.body.phone
         : false;

         const firstName =
         typeof requestProperties.body.firstName === 'string' &&
         requestProperties.body.firstName.trim().length > 0
             ? requestProperties.body.firstName
             : false;
 
     const lastName =
         typeof requestProperties.body.lastName === 'string' &&
         requestProperties.body.lastName.trim().length > 0
             ? requestProperties.body.lastName
             : false;

 
     const password =
         typeof requestProperties.body.password === 'string' &&
         requestProperties.body.password.trim().length > 0
             ? requestProperties.body.password
             : false;

             if (phone)  {
                if(firstName || lastName || password) {
                    //lookup for the user
                    data.read('users', phone, (err1,uData) => {
                        const userData = { ...parseJSON(uData)};

                        if(!err1 && userData) {
                            if(firstName) {
                                userData.firstName = firstName;
                            }
                            if(lastName) {
                                userData.lastName = lastName;
                            }
                            if(password) {
                                userData.password = hash(password);
                            }

                            //update to db
                            data.update('users', phone, userData, (err2) => {
                                if(!err2){
                                    callback(200, {
                                        "message": 'undated successfully',
                                    })
                                }else {
                                    callback(400, {
                                        error: 'problm in the server side',
                                    });
                                }
                            });
                        } else {
                            callback(400, {
                                error: 'problm in your req',
                            });
                        }
                    });
                }else {
                    callback(400, {
                        error: 'problm in your req',
                    });
                }
             }else {
                callback(400, {
                    error: 'invalid number',
                });
             }
};

handler._users.delete = (requestProperties, callback) => {
        // check the phone number if valid
        const phone =
            typeof requestProperties.queryStringObject.phone === 'string' &&
            requestProperties.queryStringObject.phone.trim().length === 11
                ? requestProperties.queryStringObject.phone
                : false;

                if(phone) {
                //look for the user
                data.read('users', phone, (err1, userdata) => {
                    if(!err1 && userdata) {
                        data.delete('users', phone, (err2) => {
                            if (!err2) {
                                callback(200, {
                                    message: 'user deleted',
                                });
                            } else {
                                callback(500, {
                                    error: "theres a problm in youre req",
                                });
                            }
                        })
                    }else {
                        callback(500, {
                            error: "theres a problm in youre req",
                        });
                    }
                });
                } else {
                    callback(400, {
                        error: "theres a problm in youre req",
                    });
                }
  
    };

module.exports = handler;
