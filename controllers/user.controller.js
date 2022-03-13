
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');

exports.login = function (req, res) {
    try {
        const userName = req.body?.username;
        const password = req.body?.password;
        if (userName && password) {
            Users.findOne({ username: userName }, async (err, data) => {
                if (data) {

                    return bcrypt.compare(password, data.password)
                        .then(hashPassword => {
                            if (hashPassword) {
                                checkUserAndGenerateToken(data, req, res);
                            } else {

                                res.status(400).json({
                                    errorMessage: 'Username or password is incorrect!',
                                    status: false
                                });
                            }
                        });
                } else {
                    res.status(400).json({
                        errorMessage: 'Username or password is incorrect!',
                        status: false
                    });
                }
            })
        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong login!',
            status: false
        });
    }
};

exports.register = function (req, res) {
    try {
        const userName = req.body?.username;
        const password = req.body?.password;
        const confirmPassword = req.body?.confirmPassword;
        if (userName && password) {

            const salt = 10;
            console.log("password: ", password);
            bcrypt.hash(password, salt, async (err, encrypted) => {
                if (err) {
                    return console.log('Cannot encrypt: ', err);
                }
                console.log("encrypted: ", encrypted);


                Users.find({ username: userName }, (err, data) => {

                    if (data.length === 0) {

                        if (password !== confirmPassword) {
                            res.status(400).json({
                                errorMessage: `Password and confirm password should match.`,
                                status: false
                            });
                        }

                        console.log("retruned hashedPassword: ", encrypted);
                        let User = new Users({
                            username: userName,
                            password: encrypted,
                            role: 'coache' //default role will be coache
                        });
                        User.save((err, data) => {
                            if (err) {
                                res.status(400).json({
                                    errorMessage: err,
                                    status: false
                                });
                            } else {
                                res.status(200).json({
                                    status: true,
                                    sucessMessage: `${userName} registered successfully.`
                                });
                            }
                        });

                    } else {
                        res.status(400).json({
                            errorMessage: `UserName ${userName} Already Exist!`,
                            status: false
                        });
                    }

                });
            });

        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong while registration!',
            status: false
        });
    }
};

exports.registerAdmin = function (req, res) {
    try {

        Users.find({ username: 'admin' }, (err, data) => {

            if (data.length === 0) {
                const salt = 10;
                bcrypt.hash('admin', salt, async (err, encrypted) => {
                    if (err) {
                        return console.log('Cannot encrypt: ', err);
                    }

                    let User = new Users({
                        username: 'admin',
                        password: encrypted,
                        role: 'admin' //default role will be admin
                    });
                    User.save((err, data) => {
                        if (err) {
                            res.status(400).json({
                                errorMessage: err,
                                status: false
                            });
                        } else {
                            res.status(200).json({
                                status: true,
                                sucessMessage: 'Admin user created successfully.'
                            });
                        }
                    });
                });

            } else {
                res.status(400).json({
                    errorMessage: `Admin user already exist!`,
                    status: false
                });
            }

        });
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong whiile registering admin!',
            status: false
        });
    }
};

function checkUserAndGenerateToken(data, req, res) {
    const token = jwt.sign({ user: data.username, id: data._id }, 'back-end-test', { expiresIn: '1d' });
    if (!token) {
        res.status(400).json({
            status: false,
            errorMessage: err,
        });
    } else {
        res.status(200).json({
            message: 'Login Successfully.',
            token: token,
            loggedinUserId: data._id,
            status: true
        });
    }
}