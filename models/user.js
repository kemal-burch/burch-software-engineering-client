    var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require ('passport-local-mongoose');

var User = new Schema(
    {
        firstName: String,
        lastName: String,
        username: {
            type: String,
            unique: true
        },
        currentRole: String,
        location: String,
        imageUrl: {
            type: String,
            default: '../images/avatar.jpg'
        },
        experiences: [{
            jobTitle: String,
            companyName: String,
            location: String,
            desc: String,
            dateFrom: String,
            dateTo: String,
            linkedTo: String,
            selectedCompany: {}
        }],
        skills: [],
        educations: [{
            college: String,
            status: String,
            course: String,
            dateFrom: String,
            dateTo: String
        }]
    },
    {
        timestamps: true
    }
);

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);