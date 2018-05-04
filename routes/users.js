var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var Verify = require('./verify');
var passport = require('passport');
var ObjectId = require('mongodb').ObjectID;

var userRouter = express.Router();

userRouter.use(bodyParser.json());


userRouter.route('/signup')

    .post(function (req, res, next) {
        User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
            if (err) {
                return res.status(500).send(err);
            }

            User.findOneAndUpdate({_id : user._id}, req.body, {new : true}, function (err, user) {
                if (err) {
                    User.remove({username: req.body.username}, function (err, result) {
                        return res.status(500).send({message: 'A user with the given E-mail is already registered'});
                    });
                }
                passport.authenticate('local')(req, res, function () {
                    var token = Verify.getToken({"username": user.username, "_id":user._id, "role": user.role});

                    res.status(200).send({
                        message: 'Login successful',
                        success: true,
                        user: user,
                        token: token
                    });
                });
            })
        });
    });

userRouter.route('/login')

    .post(function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return res.status(500).send(err);
            }

            if (info) {
                return res.status(401).send(info);
            }

            if(!user) {
                return res.status(401).send(info);
            }

            req.logIn(user, function (err) {
                if (err){
                    return res.status(500).send(err);
                }
            });
            var token = Verify.getToken({"username": user.username, "_id":user._id, "role": user.role});

            res.status(200).send({
                message: 'Login successful',
                success: true,
                user: user,
                token: token
            });
        })(req, res, next);
    });




module.exports = userRouter;