(function (Rx, Promise, Hoek, Joi) {

    //var comparisonOperators = ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin'];
    //var logicalOperators = ['$or', '$and', '$not', '$nor'];
    //var elementOperators = ['$exists', '$type'];
    //var evaluationOperators = ['$mod', '$regex', '$text', '$where'];
    //var arrayOperators = ['$all', '$elemMatch', '$size'];
    //var commentOperators = ['$comment'];
    //var projectionOperators = ['$', '$elemMatch', '$meta', '$slice'];

    module.exports = {
        query: function query(items, query) {

            return new Promise(function (resolve, reject) {

                var filtered = Rx.Observable.fromArray(items).filter(function (item) {

                    var match = true;
                    Object.keys(query).forEach(function (key) {

                        match &= Hoek.reach(item, key) === query[key].$eq;
                    });
                    return match;
                }).toArray();

                filtered.subscribe(
                    function (results) {

                        resolve(results);
                    }, reject);
            });
        }
    };
}(require('rx'), require('bluebird'), require('hoek'), require('joi')));
