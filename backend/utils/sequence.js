const { MongoClient } = require("mongodb");
const Counter = require("../models/Counter");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function getNextSequenceValue(prefix, sequenceName) {
    try {
      
       
        const sequenceDocument = await Counter.findByIdAndUpdate(
            { _id: sequenceName },
            { $inc: { sequence_value: 1 } },
            {new: true, upsert: true},
            { returnDocument: "after", upsert: true }
        );
        console.log("Counter result:", sequenceDocument); // Debugging: Log the result

        if (!sequenceDocument) {
            throw new Error(`Counter document with _id: ${sequenceName} not found`);
        }


        return `${prefix}${sequenceDocument.sequence_value.toString().padStart(4, "0")}`; 


    } catch (error) {
        console.error("Error getting next sequence value:", error);
        throw error;
    }
}

module.exports = getNextSequenceValue;