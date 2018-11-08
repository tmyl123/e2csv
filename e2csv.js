var request = require('request'),
    fs = require('fs')

var config = require('./env.js')

// Elasticsearch setup
var elasticUrl = config.elUrl + '/' + config.index + '/_search'
var postContent = config.postContent
var csvFile = config.filename

var options = {
    url: elasticUrl,
    headers: {
        'Content-Type': 'application/json'
    },
    json: postContent
}



getElasticsearch(options, function(elasticData) {
    console.log(elasticData)
        //    e2g(creds, sheetId, elasticData)
    const Json2csvParser = require('json2csv').Parser;


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


function getElasticsearch(options, cb) {
    request.post(options, function(err, res, body) {
        if (err) console.log(err)
        console.log(body)
        var docs = body.hits.hits

        var sheetdata = docs.map(e => {
            var obj = {}
            obj._index = e._index
            obj._type = e._type
            obj._id = e._id
            for (var key in e._source) {
                obj[key] = e._source[key]
            }
            return obj
        })

        cb(
            sheetdata
        )
    })
}
