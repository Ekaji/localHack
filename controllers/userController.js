const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.validateRegister = (req, res, next) => {
    const {
        fullName,
        email,
        password
    } = req.body;
    //  check if feilds are not empty
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('fullName', 'Name is required').notEmpty();

    //use express validator to sanitize all input from body
    req.sanitize(req.body);
    //check for error
    let err = req.validationErrors();
    // if any error return
    if (err) return res.status(500).json(err);

    next(); // there were no errors!
};


exports.createUser = (req, res) => {
    console.log('object :', req.body);
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        } else {
            User.findOne({
                    email: req.body.email
                })
                .exec()
                .then(reg => {
                    if (reg) {
                        return res.status(401).json({
                            message: "User already exist"
                        })
                    } else {
                        const user = new User({
                            fullName: req.body.fullName,
                            email: req.body.email,
                            password: hash
                        });

                        user
                            .save()
                            .then((result) => {
                                const token = jwt.sign({
                                        email: result.email,
                                        userId: result._id
                                    },
                                    process.env.JWT_KEY, {
                                        expiresIn: "1W"
                                    }
                                );

                                res.status(200).json({
                                    result,
                                    token,
                                    message: "User Registered successfully"
                                });
                            }).catch((err) => {
                                res.status(500).json({
                                    error: err.message
                                });
                            });
                    }
                })
        }
    })
}

exports.loginUser = (req, res) => {
    User
        .findOne({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User dos not exist'
                })
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Authentication failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "1W"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token,
                        result: user
                    });
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.getUserById = (req, res) => {
    User
        .findById(req.params.id)
        .populate('-password')
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'User dose not exist'
                });
            } else {
                res.status(200).json(result);
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.updateUser = (req, res) => {
    let options = req.body;
    const updates = {};

    for (const option of Object.keys(options)) {
        updates[option] = options[option]
    }
    User
        .findByIdAndUpdate(
            req.params.id, {
                $set: updates
            }, {
                new: true,
                contex: 'query'
            }
        )
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    result,
                    message: "Updated successfully",
                })
            } else {
                res.status(404).json({
                    message: "Invalid Member"
                })
            }
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

exports.deleteUser = (req, res) => {
    User
        .findByIdAndDelete(req.params.id)
        .exec()
        .then(result => {
            if (!result) {
                res.status(404).json({
                    message: 'User dose not exist'
                });
            } else {
                res.status(200).send({
                    message: 'User was deleted successfully'
                });
            }
        })
        .catch(err => {
            res.status(500).send(err);
        })
}