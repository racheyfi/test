const express = require('express');
var cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
const sourceDir = 'dist';
const mongoose = require('mongoose');

const port = process.env.PORT || 8082;

app.use(express.static(sourceDir));
app.use(cors());

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', require('./src/server/routes/graph'));
const connectionString = 'mongodb://koby:1234@cluster0-shard-00-00-bvcfw.mongodb.net:27017,cluster0-shard-00-01-bvcfw.mongodb.net:27017,cluster0-shard-00-02-bvcfw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
mongoose.connect(connectionString).then(
    () => console.log('connected'),
    err => console.log('not connected', err)
);


app.listen(port, () => {
    console.log(`Express web server started: http://localhost:${port}`);
    console.log(`Serving content from /${sourceDir}/`);
});
