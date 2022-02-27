const mongoose = require('mongoose');
const { models } = require('../Constants');

const nodeSchema = new mongoose.Schema({
    name: { type: String, default: null },
}, { timestamps: true });
exports.Node = mongoose.model(models.NODE, nodeSchema);