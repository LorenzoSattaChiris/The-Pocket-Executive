const { ScanCommand, GetCommand, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDB = require('./database');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'pockexe_startups';

const getItems = async () => {
    const params = {
        TableName: TABLE_NAME,
    };

    try {
        const data = await dynamoDB.send(new ScanCommand(params));
        return data.Items;
    } catch (error) {
        console.error("Error fetching items from DynamoDB", error);
        throw new Error(error);
    }
};

const getItem = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: id
        }
    };

    try {
        const data = await dynamoDB.send(new GetCommand(params));
        return data.Item;
    } catch (error) {
        console.error("Error fetching item from DynamoDB", error);
        throw new Error(error);
    }
};

const putItem = async (item) => {
    const id = `ST-${uuidv4()}`;  // Generate unique ID with "ST" prefix
    item.id = id;
    const params = {
        TableName: TABLE_NAME,
        Item: item
    };

    try {
        await dynamoDB.send(new PutCommand(params));
        return item;
    } catch (error) {
        console.error("Error putting item into DynamoDB", error);
        throw new Error(error);
    }
};

const updateItem = async (id, updateParams) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: "set #attrName = :attrValue",
        ExpressionAttributeNames: { "#attrName": Object.keys(updateParams)[0] },
        ExpressionAttributeValues: { ":attrValue": Object.values(updateParams)[0] },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        const data = await dynamoDB.send(new UpdateCommand(params));
        return data.Attributes;
    } catch (error) {
        console.error("Error updating item in DynamoDB", error);
        throw new Error(error);
    }
};

module.exports = {
    getItems,
    getItem,
    putItem,
    updateItem
};
