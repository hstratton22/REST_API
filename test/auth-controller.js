// const expect = require('chai').expect;
// const sinon = require('sinon');
// const mongoose = require('mongoose');
// const private = require('../private');

// const User = require('../models/user');
// const AuthController = require('../controllers/auth');

// describe('Auth controller ', function () {
//     before(function (done) {
//         mongoose.connect(private.dbURL_Test)
//             .then(result => {
//                 const user = new User({
//                     email: 'test@ts.com',
//                     password: 'tester',
//                     name: 'Test',
//                     posts: [],
//                     _id: '5c0fbbgos0eprja '//get actual userId?
//                 });
//                 return user.save()
//             })
//             .then(() => {
//                 done();
//             })
//     })
//     it('should throw an error with code 500 if accessing the database fails', function () {
//         sinon.stub(User, 'findOne');
//         User.findOne.throws();
//         const req = {
//             body: {
//                 email: 'test@tst.com',
//                 passwrod: 'tester'
//             }
//         };
//         AuthController.login(req, {}, () => { }).then(resulte => {
//             expect(result).to.be.an('error');
//             expect(result).to.have.property('statusCode', 500);
//             done();//needed to test async
//         });

//         User.findOne.restore();
//     });
//     it('should send a response with a valid user status fo ran existing user', function (done) {


//         const req = { userId: '5c0fbbgos0eprja' }
//         const res = {
//             statusCode: 500,
//             userStatus: null,
//             status: function (code) {
//                 this.statusCode = code;
//                 return this;
//             },
//             json: function (data) {
//                 this.userStatus = data.status;
//             }
//         };
//         AuthController.getUserStatus(req, res, () => { }).then(() => {
//             expect(res.statusCode).to.be.equal(200);
//             expect(res.userStatus).to.be.equal('I am new!');
//             done();

//         });

//     });
//     after(function (done) {
//         User.deleteMany({})
//             .then(() => {
//                 return mongoose.disconnect();
//             })
//             .then(() => {
//                 done();

//             });
//     });
//     // beforeEach(function() {

//     // })
//     // afterEach(function() {

//     // })
// });

// //json scripts test :"mocha --timeout 5000"