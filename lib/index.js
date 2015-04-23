(function (Rx, Promise, Hoek, Joi) {

    var internals = {};

    internals.fieldSchema = Joi.object().keys({
        $eq: Joi.any(),
        $gt: Joi.any(),
        $gte: Joi.any(),
        $lt: Joi.any(),
        $lte: Joi.any(),
        $ne: Joi.any(),
        $in: Joi.array().items(Joi.any()),
        $nin: Joi.array().items(Joi.any()),
        $exists: Joi.boolean(),
        $type: Joi.string(),
        $mod: Joi.array().items(Joi.number().integer()).min(2).max(2),
        $regex: Joi.object().type(RegExp),
        $where: Joi.func(),
        $all: Joi.array().items(Joi.any()),
        $elemMatch: Joi.array().items(Joi.any()),
        $size: Joi.number().integer(),
        $not: Joi.object().keys({
            $eq: Joi.any(),
            $gt: Joi.any(),
            $gte: Joi.any(),
            $lt: Joi.any(),
            $lte: Joi.any(),
            $ne: Joi.any(),
            $in: Joi.array().items(Joi.any()),
            $nin: Joi.array().items(Joi.any()),
            $exists: Joi.boolean(),
            $type: Joi.string(),
            $mod: Joi.array().items(Joi.number().integer()).min(2).max(2),
            $regex: Joi.object().type(RegExp),
            $where: Joi.func(),
            $all: Joi.array().items(Joi.any()),
            $elemMatch: Joi.array().items(Joi.any()),
            $size: Joi.number().integer()
        }).or('$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin', '$exists', '$type', '$mod', '$regex', '$where', '$all', '$elemMatch', '$size')
    }).or('$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin', '$exists', '$type', '$mod', '$regex', '$where', '$all', '$elemMatch', '$size', '$not');

    internals.filterSchema = Joi.object().keys({
        $or: Joi.array().items(Joi.object().pattern(/^[^\$].*/, internals.fieldSchema)),
        $and: Joi.array().items(Joi.object().pattern(/^[^\$].*/, internals.fieldSchema)),
        $nor: Joi.array().items(Joi.object().pattern(/^[^\$].*/, internals.fieldSchema))
    }).pattern(/^[^\$].*/, internals.fieldSchema);

    internals.querySchema = Joi.object().keys({
        $match: Joi.object().optional()
    });

    internals.negate = function (value) {

        return !value;
    };

    internals.comparison = {};

    internals.comparison.$size = function $size(items, key, expected, comparator) {

        return items.filter(function (item) {

            var value = Hoek.reach(item, key);
            var result = false;
            if (value) {
                result = value.length === expected;
            }
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$elemMatch = function $elemMatch(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = Hoek.contain(Hoek.reach(item, key), expected);
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$all = function $all(items, key, expected, comparator) {

        return items.filter(function (item) {

            var value = Hoek.reach(item, key);
            var result = Hoek.contain(value, expected) && value.length === expected.length;
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$where = function $where(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = expected(Hoek.reach(item, key));
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$regex = function $regex(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = expected.test(Hoek.reach(item, key));
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$mod = function $mod(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = Hoek.reach(item, key) % expected[0] === expected[1];
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$type = function $type(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = typeof Hoek.reach(item, key) === expected;
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$exists = function $exists(items, key, expected, comparator) {

        return items.filter(function (item) {

            var keyFinalPart = key.lastIndexOf('.');
            var result = false;
            if (keyFinalPart >= 0) {
                result = key.slice(keyFinalPart + 1) in (Hoek.reach(item, key.slice(0, keyFinalPart)) || {} );
            } else {
                result = key in item;
            }
            result = result === expected;
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$nin = function $in(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = !Hoek.contain(expected, Hoek.reach(item, key), {deep: true});
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$in = function $in(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = Hoek.contain(expected, Hoek.reach(item, key), {deep: true});
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$gt = function $gt(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = Hoek.reach(item, key) > expected;
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$gte = function $gte(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = Hoek.reach(item, key) >= expected;
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$lt = function $lt(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = Hoek.reach(item, key) < expected;
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$lte = function $lte(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = Hoek.reach(item, key) <= expected;
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$ne = function $ne(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = !Hoek.deepEqual(Hoek.reach(item, key), expected, {prototype: false});
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$eq = function $eq(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = Hoek.deepEqual(Hoek.reach(item, key), expected, {prototype: false});
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$not = function $not(items, key, condition) {

        var results = items;
        Object.keys(condition).forEach(function (comparisonKey) {

            results = internals.comparison[comparisonKey](results, key, condition[comparisonKey], internals.negate);
        });


        return results;
    };

    internals.logical = {};

    internals.logical.$and = function $and(items, filter) {

        var results = items;

        filter.$and.forEach(function (condition) {

            results = internals.filter(results, condition);
        });

        return results;
    };

    internals.logical.$or = function $and(items, filter) {

        var leftovers = items;
        var results = Rx.Observable;

        filter.$or.forEach(function (condition) {

            results = results.concat(internals.filter(leftovers, condition));
            leftovers = internals.filter(leftovers, condition, internals.negate);
        });

        return results;
    };

    internals.logical.$nor = function $and(items, filter) {

        var results = items;

        filter.$nor.forEach(function (condition) {

            results = internals.filter(results, condition, internals.negate);
        });

        return results;
    };

    internals.filter = function filter(items, filter, comparator) {

        var results = items;
        Object.keys(filter).forEach(function (key) {

            if (key.charAt(0) === '$') {
                results = internals.logical[key](results, filter);
            } else {
                Object.keys(filter[key]).forEach(function (comparisonKey) {

                    results = internals.comparison[comparisonKey](results, key, filter[key][comparisonKey], comparator);
                });
            }
        });

        return results;
    };

    module.exports = {
        filter: function filter(items, filter, options) {

            options = options || {};
            filter = filter || {};

            return new Promise(function (resolve, reject) {

                var validation = Joi.validate(filter, internals.filterSchema);

                if (validation.error) {
                    return reject(validation.error);
                }

                var results = internals.filter(Rx.Observable.fromArray(items), filter);

                if (options.stream) {
                    resolve(results);
                } else {
                    results
                        .toArray()
                        .subscribe(
                        function (results) {

                            resolve(results);
                        }, reject);
                }
            });
        }
    };

}(require('rx'), require('bluebird'), require('hoek'), require('joi')));
