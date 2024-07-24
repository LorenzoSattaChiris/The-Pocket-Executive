// investor_service.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME_INVESTORS = 'pockexe_investors';
const TABLE_NAME_STARTUPS = 'pockexe_startups';

const dynamoDBClient = new DynamoDBClient({ region: process.env.region });
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

const createInvestor = async (investor) => {
    const id = `INV-${uuidv4()}`;
    investor.id = id;
    const params = {
        TableName: TABLE_NAME_INVESTORS,
        Item: investor
    };

    try {
        console.log("Attempting to create investor with params:", params);
        await dynamoDB.send(new PutCommand(params));
        return investor;
    } catch (error) {
        console.error("Error putting investor into DynamoDB", error);
        throw new Error(error);
    }
};

const getInvestor = async (id) => {
    const params = {
        TableName: TABLE_NAME_INVESTORS,
        Key: {
            id: id
        }
    };

    try {
        const data = await dynamoDB.send(new GetCommand(params));
        return data.Item;
    } catch (error) {
        console.error("Error fetching investor from DynamoDB", error);
        throw new Error(error);
    }
};

const getStartups = async () => {
    const params = {
        TableName: TABLE_NAME_STARTUPS,
    };

    try {
        const data = await dynamoDB.send(new ScanCommand(params));
        return data.Items;
    } catch (error) {
        console.error("Error scanning startups from DynamoDB", error);
        throw new Error(error);
    }
};

const getStartupById = async (id) => {
    const params = {
        TableName: TABLE_NAME_STARTUPS,
        Key: {
            id: id
        }
    };

    try {
        const data = await dynamoDB.send(new GetCommand(params));
        return data.Item;
    } catch (error) {
        console.error("Error fetching startup from DynamoDB", error);
        throw new Error(error);
    }
};

module.exports = {
    createInvestor,
    getInvestor,
    getStartups,
    getStartupById
};
