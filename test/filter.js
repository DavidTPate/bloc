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

describe('filter()', function () {

    var testData = [
        {
            name: 'Nigel Thornberry',
            age: 42,
            email: {
                address: 'nigel.thornberry@thewildthornberrys.com'
            },
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
            email: {
                address: 'tony@stark.com'
            },
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

    it('should provide a friendly message on an invalid filter', function (done) {

        Bloc.filter(testData, {
            age: {}
        }).then(function () {

            done(new Error('Expected to throw'));
        }, function (reason) {

            expect(reason).to.be.instanceOf(Error);
            expect(reason.message).to.equal('child "age" fails because ["value" must contain at least one of [$eq, $gt, $gte, $lt, $lte, $ne, $in, $nin, $not]]');
            done();
        });
    });

    it('should send back all results when there isn\'t a filter', function (done) {

        Bloc.filter(testData).then(function (results) {

            expect(results[0]).to.equal(testData[0]);
            expect(results[1]).to.equal(testData[1]);
            expect(results.length).to.equal(2);
            done();
        }, done).catch(done);
    });

    it('should send back the stream instead of the results when requested', function (done) {

        Bloc.filter(testData, {}, {stream: true}).then(function (stream) {

            stream
                .toArray()
                .subscribe(
                function (results) {

                    expect(results[0]).to.equal(testData[0]);
                    expect(results[1]).to.equal(testData[1]);
                    expect(results.length).to.equal(2);
                }, done);

            done();
        }, done).catch(done);
    });

    describe('$eq', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                age: {
                    $eq: 34
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });

        it('should be able to filter with an object', function (done) {

            Bloc.filter(testData, {
                email: {
                    $eq: {
                        address: 'tony@stark.com'
                    }
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$in', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                age: {
                    $in: [34]
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });

        it('should be able to filter with an object', function (done) {

            Bloc.filter(testData, {
                email: {
                    $in: [{
                        address: 'tony@stark.com'
                    }]
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$nin', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                age: {
                    $nin: [42]
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });

        it('should be able to filter with an object', function (done) {

            Bloc.filter(testData, {
                email: {
                    $nin: [{
                        address: 'nigel.thornberry@thewildthornberrys.com'
                    }]
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$ne', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                age: {
                    $ne: 42
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });

        it('should be able to filter with an object', function (done) {

            Bloc.filter(testData, {
                email: {
                    $ne: {
                        address: 'nigel.thornberry@thewildthornberrys.com'
                    }
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$gt', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                age: {
                    $gt: 34
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$gte', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                age: {
                    $gte: 34
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results[1]).to.equal(testData[1]);
                expect(results.length).to.equal(2);
                done();
            }, done).catch(done);
        });
    });

    describe('$lt', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                age: {
                    $lt: 42
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$lte', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                age: {
                    $lte: 42
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results[1]).to.equal(testData[1]);
                expect(results.length).to.equal(2);
                done();
            }, done).catch(done);
        });
    });

    describe('$and', function () {

        it('should be able to filter on multiple keys', function (done) {

            Bloc.filter(testData, {
                $and: [
                    {
                        age: {
                            $eq: 34
                        }
                    },
                    {
                        name: {
                            $eq: 'Anthony Stark'
                        }
                    }
                ]
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$not', function () {

        describe('$eq', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $eq: 42
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[1]);
                    expect(results.length).to.equal(1);
                    done();
                }, done).catch(done);
            });
        });

        describe('$in', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $in: [42]
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[1]);
                    expect(results.length).to.equal(1);
                    done();
                }, done).catch(done);
            });
        });

        describe('$nin', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $nin: [34]
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[1]);
                    expect(results.length).to.equal(1);
                    done();
                }, done).catch(done);
            });
        });

        describe('$ne', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $ne: 34
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[1]);
                    expect(results.length).to.equal(1);
                    done();
                }, done).catch(done);
            });
        });

        describe('$gt', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $gt: 42
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[0]);
                    expect(results[1]).to.equal(testData[1]);
                    expect(results.length).to.equal(2);
                    done();
                }, done).catch(done);
            });
        });

        describe('$gte', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $gte: 42
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[1]);
                    expect(results.length).to.equal(1);
                    done();
                }, done).catch(done);
            });
        });

        describe('$lt', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $lt: 34
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[0]);
                    expect(results[1]).to.equal(testData[1]);
                    expect(results.length).to.equal(2);
                    done();
                }, done).catch(done);
            });
        });

        describe('$lte', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $lte: 34
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[0]);
                    expect(results.length).to.equal(1);
                    done();
                }, done).catch(done);
            });
        });
    });
});
