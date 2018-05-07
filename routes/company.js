var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var Company = require('../models/company');
var Verify = require('./verify');
var ObjectId = require('mongodb').ObjectID;

var companyRouter = express.Router();

companyRouter.use(bodyParser.json());

companyRouter.route('/getall')

    .get(function (req, res, next) {
        Company.find({}, function (err, company) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send(company);
        })
    });

companyRouter.route('/add')

    .post(function (req, res, next) {
        Company.create(req.body, function (err, company) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send(company);
        })
    });


module.exports = companyRouter;