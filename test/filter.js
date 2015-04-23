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
            tags: ['billionaire', 'playboy', 'philanthropist'],
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
            expect(reason.message).to.equal('child "age" fails because ["value" must contain at least one of [$eq, $gt, $gte, $lt, $lte, $ne, $in, $nin, $exists, $type, $mod, $regex, $where, $all, $elemMatch, $size, $not]]');
            done();
        }).catch(done);
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

    describe('$exists', function () {

        it('should be able to filter on a key not existing that exists', function (done) {

            Bloc.filter(testData, {
                age: {
                    $exists: false
                }
            }).then(function (results) {

                expect(results.length).to.equal(0);
                done();
            }, done).catch(done);
        });

        it('should be able to filter on existent key', function (done) {

            Bloc.filter(testData, {
                age: {
                    $exists: true
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results[1]).to.equal(testData[1]);
                expect(results.length).to.equal(2);
                done();
            }, done).catch(done);
        });

        it('should be able to filter when a key doesn\'t exist', function (done) {

            Bloc.filter(testData, {
                'first.second.someKey': {
                    $exists: false
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results[1]).to.equal(testData[1]);
                expect(results.length).to.equal(2);
                done();
            }, done).catch(done);
        });

        it('should be able to filter on a sub-property', function (done) {

            Bloc.filter(testData, {
                'email.address': {
                    $exists: true
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results[1]).to.equal(testData[1]);
                expect(results.length).to.equal(2);
                done();
            }, done).catch(done);
        });

        it('should be able to filter on a sub-property not existing when it does', function (done) {

            Bloc.filter(testData, {
                'email.address': {
                    $exists: false
                }
            }).then(function (results) {

                expect(results.length).to.equal(0);
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

    describe('$type', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                age: {
                    $type: 'number'
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results[1]).to.equal(testData[1]);
                expect(results.length).to.equal(2);
                done();
            }, done).catch(done);
        });
    });

    describe('$regex', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                name: {
                    $regex: /^Anthony/
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$regex', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                name: {
                    $where: function(value) {

                        return /^Anthony/.test(value);
                    }
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$mod', function () {

        it('should be able to filter on a top level key', function (done) {

            Bloc.filter(testData, {
                age: {
                    $mod: [2, 0]
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results[1]).to.equal(testData[1]);
                expect(results.length).to.equal(2);
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

    describe('$size', function () {

        it('should be able to filter on multiple keys', function (done) {

            Bloc.filter(testData, {
                tags: {
                    $size: 3
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });

        it('should be able to filter on a value that doesn\'t exist', function (done) {

            Bloc.filter(testData, {
                asdf: {
                    $size: 3
                }
            }).then(function (results) {

                expect(results.length).to.equal(0);
                done();
            }, done).catch(done);
        });
    });

    describe('$elemMatch', function () {

        it('should be able to filter on multiple keys', function (done) {

            Bloc.filter(testData, {
                tags: {
                    $elemMatch: [
                        'billionaire',
                        'playboy'
                    ]
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$all', function () {

        it('should be able to filter on multiple keys', function (done) {

            Bloc.filter(testData, {
                tags: {
                    $all: [
                        'billionaire',
                        'playboy',
                        'philanthropist'
                    ]
                }
            }).then(function (results) {

                expect(results[0]).to.equal(testData[1]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });
    });

    describe('$or', function () {

        it('should be able to filter on multiple keys', function (done) {

            Bloc.filter(testData, {
                $or: [
                    {
                        age: {
                            $eq: 42
                        }
                    },
                    {
                        name: {
                            $eq: 'Anthony Stark'
                        }
                    }
                ]
            }).then(function (results) {

                expect(results[0]).to.equal(testData[0]);
                expect(results[1]).to.equal(testData[1]);
                expect(results.length).to.equal(2);
                done();
            }, done).catch(done);
        });

        it('shouldn\'t filter duplicates when matching multiple conditions', function (done) {

            var dupeTestData = [testData[1]].concat(testData);
            Bloc.filter(dupeTestData, {
                $or: [
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
                expect(results[1]).to.equal(testData[1]);
                expect(results.length).to.equal(2);
                done();
            }, done).catch(done);
        });
    });

    describe('$nor', function () {

        it('should be able to filter on multiple keys', function (done) {

            Bloc.filter(testData, {
                $nor: [
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

                expect(results[0]).to.equal(testData[0]);
                expect(results.length).to.equal(1);
                done();
            }, done).catch(done);
        });

        it('shouldn\'t filter duplicates when matching multiple conditions', function (done) {

            Bloc.filter(testData, {
                $nor: [
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

                expect(results[0]).to.equal(testData[0]);
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

        describe('$exists', function () {

            it('should be able to filter on a key not existing that exists', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $exists: false
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[0]);
                    expect(results[1]).to.equal(testData[1]);
                    expect(results.length).to.equal(2);
                    done();
                }, done).catch(done);
            });

            it('should be able to filter on existent key', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $exists: true
                        }
                    }
                }).then(function (results) {

                    expect(results.length).to.equal(0);
                    done();
                }, done).catch(done);
            });

            it('should be able to filter when a key doesn\'t exist', function (done) {

                Bloc.filter(testData, {
                    'first.second.someKey': {
                        $not: {
                            $exists: false
                        }
                    }
                }).then(function (results) {

                    expect(results.length).to.equal(0);
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

        describe('$type', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $type: 'number'
                        }
                    }
                }).then(function (results) {

                    expect(results.length).to.equal(0);
                    done();
                }, done).catch(done);
            });
        });

        describe('$mod', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    age: {
                        $not: {
                            $mod: [6, 0]
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[1]);
                    expect(results.length).to.equal(1);
                    done();
                }, done).catch(done);
            });
        });

        describe('$regex', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    name: {
                        $not: {
                            $regex: /^Anthony/
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[0]);
                    expect(results.length).to.equal(1);
                    done();
                }, done).catch(done);
            });
        });

        describe('$where', function () {

            it('should be able to filter on a top level key', function (done) {

                Bloc.filter(testData, {
                    name: {
                        $not: {
                            $where: function(value) {

                                return /^Anthony/.test(value);
                            }
                        }
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

        describe('$all', function () {

            it('should be able to filter on multiple keys', function (done) {

                Bloc.filter(testData, {
                    tags: {
                        $not: {
                            $all: [
                                'billionaire',
                                'playboy',
                                'philanthropist'
                            ]
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[0]);
                    expect(results.length).to.equal(1);
                    done();
                }, done).catch(done);
            });
        });

        describe('$elemMatch', function () {

            it('should be able to filter on multiple keys', function (done) {

                Bloc.filter(testData, {
                    tags: {
                        $not: {
                            $elemMatch: [
                                'billionaire',
                                'playboy'
                            ]
                        }
                    }
                }).then(function (results) {

                    expect(results[0]).to.equal(testData[0]);
                    expect(results.length).to.equal(1);
                    done();
                }, done).catch(done);
            });
        });

        describe('$size', function () {

            it('should be able to filter on multiple keys', function (done) {

                Bloc.filter(testData, {
                    tags: {
                        $not: {
                            $size: 3
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
