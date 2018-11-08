var fs = require('fs'),
    Json2csvParser = require('json2csv').Parser,
    elasticsearch = require('elasticsearch');

var config = require('./env.js')

var client = new elasticsearch.Client({
    host: config.elasticHost,
    log: 'trace'
});

var csvFile = config.filename


getElasticsearch(config.index, config.postContent, function(elasticData) {
    console.log(elasticData)
    try {
        const parser = new Json2csvParser();
        const csv = parser.parse(elasticData);
        console.log(csv);

        fs.writeFile(csvFile, csv, function() {
            console.log('write to file complete!')
        })

    } catch (err) {
        console.error(err);
    }
})


function getElasticsearch(index, postContent, cb) {
    client.search({
        index: index,
        body: postContent
    }, function(err, resp) {
        console.log(resp)
        var docs = resp.hits.hits
        var sheetdata = docs.map(e => {
            var obj = {}
            obj._id = e._id
            for (var key in e._source) {
                obj[key] = e._source[key]
            }
            return obj
        })
        cb(sheetdata)
    });
}
