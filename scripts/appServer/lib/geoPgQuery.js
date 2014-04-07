var pg = require('pg');
var errorMessages = {
    postgresConnectError: 'could not connect to postgres',
    postgresQueryError: 'error running query'
};

// this is a generic query executor and should rarely be used - maybe just to execute stored procedures
exports.pgQueryExecutor = function (query, success, error) {
    this.executeQuery = function() {
        var conString = "Connection String";
        var client = new pg.Client(conString);
        client.connect(function (err) {
            if (err) error(errorMessages.postgresConnectError);
            client.query(query, function (err, result) {
                if (err) error(errorMessages.postgresQueryError);
                success(result);
                client.end();
            });
        });
    }
};