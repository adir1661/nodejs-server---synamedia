const mongoose = require('mongoose');
const { models } = require('../Constants');

const nodeSchema = new mongoose.Schema({
    name: { type: String, default: null },
    parent: {
        index:true,
        type: mongoose.Types.ObjectId,
        ref: models.NODE,
        default:null,
    }
}, { timestamps: true });
exports.Node = mongoose.model(models.NODE, nodeSchema);