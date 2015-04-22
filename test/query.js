// Load modules
var Lab = require('lab');
var Code = require('code');
var Bloc = require('../lib');

// Test shortcuts
var lab = exports.lab = Lab.script();
var before = lab.before;
var after = lab.after;
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('query()', function () {

    var testData = [
        {
            name: 'Nigel Thornberry',
            age: 42,
            tags: ['explorer', 'father', 'traveler', 'photographer'],
            hobbies: [
                {
                    name: 'exploring',
                    description: 'Exploring is cool and such'
                },
                {
                    name: 'rving'
                },
                {
                    name: 'photography',
                    places: [
                        'everywhere'
                    ]
                },
                {
                    name: 'backpacking'
                }
            ]
        },
        {
            name: 'Anthony Stark',
            age: 34,
            tags: ['billionaire', 'playboy', 'philanthropist', 'iron man'],
            hobbies: [
                {
                    name: 'being-awesome'
                },
                {
                    name: 'flying'
                },
                {
                    name: 'shooting-missles'
                }
            ]
        }
    ];

    it('should provide a friendly message on an invalid query', function (done) {

        Bloc.query(testData, {
            age: {
                $eq: 42
            }
        }).then(function () {

            done(new Error('Expected to throw'));
        }, function (reason) {

            expect(reason).to.be.instanceOf(Error);
            expect(reason.message).to.equal('"age" is not allowed');
            done();
        });
    });

    it('should send back all results when there isn\'t a query', function(done) {

       Bloc.query(testData).then(function(results) {

           expect(results[0]).to.equal(testData[0]);
           expect(results[1]).to.equal(testData[1]);
           expect(results.length).to.equal(2);
           done();
       }, done);
    });

    describe('$eq', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.query(testData, {
                $match: {
                    age: {
                        $eq: 42
                    }
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results.length).to.equal(1);
                done();
            }, done);
        });

        it('should be able to filter with multiple top level keys', function (done) {

            Bloc.query(testData, {
                $match: {
                    age: {
                        $eq: 42
                    },
                    name: {
                        $eq: 'Nigel Thornberry'
                    }
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results.length).to.equal(1);
                done();
            }, done);
        });
    });

    //describe('$or', function () {
    //    it('should be able to filter with multiple top level keys', function (done) {
    //
    //        Bloc.query(testData, {
    //            $or: [
    //                {
    //                    age: {
    //                        $eq: 42
    //                    }
    //                },
    //                {
    //                    age: {
    //                        $eq: 42
    //                    }
    //                }
    //            ]
    //        }).then(function (results) {
    //
    //            expect(results[0]).to.equal(testData[0]);
    //            done();
    //        }, done);
    //    });
    //});
});
