(function (Rx, Promise, Hoek, Joi) {

    //var comparisonOperators = ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin'];
    //var logicalOperators = ['$or', '$and', '$not', '$nor'];
    //var elementOperators = ['$exists', '$type'];
    //var evaluationOperators = ['$mod', '$regex', '$text', '$where'];
    //var arrayOperators = ['$all', '$elemMatch', '$size'];
    //var commentOperators = ['$comment'];
    //var projectionOperators = ['$', '$elemMatch', '$meta', '$slice'];

    var internals = {
        querySchema: Joi.object({
            $match: Joi.object().optional()
        }).optional()
    };

    module.exports = {
        query: function query(items, query) {

            query = query || {};

            return new Promise(function (resolve, reject) {

                var validation = Joi.validate(query, internals.querySchema);

                if (validation.error) {
                    return reject(validation.error);
                }

                var results = Rx.Observable.fromArray(items);
                if (query.$match) {
                    results = internals.$match(results, query.$match);
                }

                results
                    .toArray()
                    .subscribe(
                    function (results) {

                        resolve(results);
                    }, reject);
            });
        }
    };

    internals.$match = function $match(stream, query) {

        var results = stream;
        results = results.filter(function (item) {

            var match = true;
            Object.keys(query).forEach(function (key) {

                Object.keys(query[key]).forEach(function (comparisonKey) {

                    match &= internals.comparison[comparisonKey](Hoek.reach(item, key), query[key][comparisonKey]);
                });
            });
            return match;
        });
        return results;
    };

    internals.comparison = {};

    internals.comparison.$eq = function $eq(value, expected) {

        return value === expected;
    };

}(require('rx'), require('bluebird'), require('hoek'), require('joi')));
