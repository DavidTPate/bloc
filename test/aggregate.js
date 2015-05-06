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

describe('aggregate()', function () {

    var testData = [
        {
            a: 1
        },
        {
            a: 2
        },
        {
            a: 3
        },
        {
            a: 4
        },
        {
            a: 5
        },
        {
            a: 6
        }
    ];

    it('should provide a friendly message on an invalid aggregation', function (done) {

        Bloc.aggregate(testData, {
            something: {}
        }).then(function () {

            done(new Error('Expected to throw'));
        }, function (reason) {

            expect(reason).to.be.instanceOf(Error);
            expect(reason.message).to.equal('"something" is not allowed');
            done();
        }).catch(done);
    });

    it('should be able to use a stream as the input', function (done) {

        var Rx = require('rx');

        Bloc.aggregate(Rx.Observable.from(testData), null).then(function (results) {

            expect(results[0]).to.equal(testData[0]);
            expect(results[1]).to.equal(testData[1]);
            expect(results[2]).to.equal(testData[2]);
            expect(results[3]).to.equal(testData[3]);
            expect(results[4]).to.equal(testData[4]);
            expect(results[5]).to.equal(testData[5]);
            expect(results[6]).to.equal(testData[6]);
            expect(results.length).to.equal(6);
            done();
        }, done).catch(done);
    });

    it('should send back the stream instead of the results when requested', function (done) {

        Bloc.aggregate(testData, null, {stream: true}).then(function (stream) {

            stream
                .toArray()
                .subscribe(
                function (results) {

                    expect(results[0]).to.equal(testData[0]);
                    expect(results[1]).to.equal(testData[1]);
                    expect(results[2]).to.equal(testData[2]);
                    expect(results[3]).to.equal(testData[3]);
                    expect(results[4]).to.equal(testData[4]);
                    expect(results[5]).to.equal(testData[5]);
                    expect(results[6]).to.equal(testData[6]);
                    expect(results.length).to.equal(6);
                }, done);

            done();
        }, done).catch(done);
    });

    it('should be able to use a stream as the input and get a stream as the output', function (done) {

        var Rx = require('rx');

        Bloc.aggregate(Rx.Observable.from(testData), null, {stream: true}).then(function (stream) {

            stream
                .toArray()
                .subscribe(
                function (results) {

                    expect(results[0]).to.equal(testData[0]);
                    expect(results[1]).to.equal(testData[1]);
                    expect(results[2]).to.equal(testData[2]);
                    expect(results[3]).to.equal(testData[3]);
                    expect(results[4]).to.equal(testData[4]);
                    expect(results[5]).to.equal(testData[5]);
                    expect(results[6]).to.equal(testData[6]);
                    expect(results.length).to.equal(6);
                }, done);

            done();
        }, done).catch(done);
    });

    describe('$match', function () {

        it('should be able to match items', function (done) {

            Bloc.aggregate(testData, {
                $match: {
                    a: {
                        $eq: 1
                    }
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$skip', function () {

        it('should be able to skip items', function (done) {

            Bloc.aggregate(testData, {
                $skip: 5
            }).then(function (results) {

                expect(results[0]).to.equal(testData[5]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$limit', function () {

        it('should be able to limit items', function (done) {

            Bloc.aggregate(testData, {
                $limit: 1
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });
});
