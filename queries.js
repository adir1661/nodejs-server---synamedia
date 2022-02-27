const mongoose = require('mongoose');
const { Node } = require('./models/nodes');
const { Relation } = require('./models/relations');
const { ObjectId } = mongoose.Types;

const { DATABASE_USERNAME, MONGO_DOMAIN, DATABASE_NAME, DATABASE_PASSWORD, } = process.env

const mongoUri = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${MONGO_DOMAIN}/${DATABASE_NAME}?retryWrites=true&w=majority`
console.log(mongoUri)
mongoose.connect(mongoUri, () => {
  console.log('mongo connected!')
})

/*-------------nodes CRUD----------------*/
const getNodes = async (request, response) => {
  try {
    const { parent } = request.query;
    let results;
    if (parent) {
      const aggregation = await Relation.aggregate([
        { $match: { parent: ObjectId(parent) } },
        {
          $lookup: {
            from: 'nodes',
            localField: 'child',
            foreignField: '_id',
            as: 'children'
          }
        },
        {
          $replaceRoot: {
            newRoot: { $arrayElemAt: ['$children', 0] }
          }
        }
      ]);
      console.log({ aggregation })
      results = aggregation.map(child => ({ ...child, parent }));
    } else {
      results = await Node.find({ parent: null });
    }
    return response.status(200).json(results);
  } catch (error) {
    if (error) {
      console.error(error);
      response.status(502).json(error.message);
    }
  }
}


const createNode = async (request, response) => {
  try {
    const { name } = request.body;
    const { parentId } = request.params;
    debugger;
    if (!name) {
      return response.status(502).send(`please provide a name to the node`);
    }
    const node = new Node({
      name,
      parent: parentId ? ObjectId(parentId) : null
    });
    const savedNode = await node.save();
    const responseBody = { message: `Node added with ID: ${savedNode._id}`, data: savedNode }
    if (parentId) {
      const relation = new Relation({
        child: savedNode._id,
        parent: ObjectId(parentId),
      })
      responseBody.relation = await relation.save();
    };
    return response.status(201).send(responseBody);
  } catch (error) {
    console.error(error)
    response.status(502).send(`there was error on the server`);
  }
}


module.exports = {
  getNodes,
  createNode,
}
