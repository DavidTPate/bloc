(function (Rx, Promise, Hoek, Joi) {

    //var comparisonOperators = ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin'];
    //var logicalOperators = ['$or', '$and', '$not', '$nor'];
    //var elementOperators = ['$exists', '$type'];
    //var evaluationOperators = ['$mod', '$regex', '$text', '$where'];
    //var arrayOperators = ['$all', '$elemMatch', '$size'];
    //var commentOperators = ['$comment'];
    //var projectionOperators = ['$', '$elemMatch', '$meta', '$slice'];

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
        $not: Joi.object().keys({
            $eq: Joi.any(),
            $gt: Joi.any(),
            $gte: Joi.any(),
            $lt: Joi.any(),
            $lte: Joi.any(),
            $ne: Joi.any(),
            $in: Joi.array().items(Joi.any()),
            $nin: Joi.array().items(Joi.any())
        }).or('$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin')
    }).or('$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin', '$not');

    internals.filterSchema = Joi.object().keys({
        $or: Joi.array().items(internals.fieldSchema),
        $and: Joi.array().items(Joi.object().pattern(/^[^\$].*/, internals.fieldSchema)),
        $nor: Joi.array().items(internals.fieldSchema)
    }).pattern(/^[^\$].*/, internals.fieldSchema);

    internals.querySchema = Joi.object().keys({
        $match: Joi.object().optional()
    });

    internals.negate = function (value) {

        return !value;
    };

    internals.comparison = {};

    internals.comparison.$nin = function $in(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = !Hoek.contain(expected, Hoek.reach(item, key), { deep: true });
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$in = function $in(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = Hoek.contain(expected, Hoek.reach(item, key), { deep: true });
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

            var result = Hoek.reach(item, key) !== expected;
            return comparator ? comparator(result) : result;
        });
    };

    internals.comparison.$eq = function $eq(items, key, expected, comparator) {

        return items.filter(function (item) {

            var result = Hoek.deepEqual(Hoek.reach(item, key), expected, { prototype: false });
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

    internals.filter = function filter(items, filter) {

        var results = items;
        Object.keys(filter).forEach(function (key) {

            if (key.charAt(0) === '$') {
                results = internals.logical[key](results, filter);
            } else {
                Object.keys(filter[key]).forEach(function (comparisonKey) {

                    results = internals.comparison[comparisonKey](results, key, filter[key][comparisonKey]);
                });
            }
        });

        return results;
    };

    module.exports = {
        filter: function filter(items, filter) {

            filter = filter || {};

            return new Promise(function (resolve, reject) {

                var validation = Joi.validate(filter, internals.filterSchema);

                if (validation.error) {
                    return reject(validation.error);
                }

                internals.filter(Rx.Observable.fromArray(items), filter)
                    .toArray()
                    .subscribe(
                    function (results) {

                        resolve(results);
                    }, reject);
            });
        }
    };

}(require('rx'), require('bluebird'), require('hoek'), require('joi')));
