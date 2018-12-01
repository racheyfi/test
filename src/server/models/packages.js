const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    package: { type: String, required: true },
    parent: { type: String },
});

const PackageModel = mongoose.model('Packages', PackageSchema);
module.exports = PackageModel;
