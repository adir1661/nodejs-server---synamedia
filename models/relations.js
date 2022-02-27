const mongoose = require('mongoose');
const { models } = require('../Constants');

const relatioinSchema = new mongoose.Schema({
    child: {
        index: true,
        type: mongoose.Types.ObjectId,
        ref: models.NODE,
        required: null,
    },
    parent: {
        index: true,
        type: mongoose.Types.ObjectId,
        ref: models.NODE,
        required: null,
    }
}, { timestamps: true })
exports.Relation = mongoose.model(models.RELATION, relatioinSchema);