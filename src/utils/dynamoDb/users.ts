import { DynamoDBClient, PutItemCommand, PutItemCommandInput, QueryCommand } from '@aws-sdk/client-dynamodb';
import { UserInformation } from "@/models/users/userInformation";

const dynamoClient = new DynamoDBClient({
    region: 'eu-west-2',
    credentials: {
        accessKeyId: process.env.DYNAMODB_AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.DYNAMODB_AWS_SECRET_ACCESS_KEY ?? ''
    }
});

export const validateUser = async (
    username: string,
    password: string
): Promise<UserInformation> => {
    try {
        const response = await retrieveUser(username);
        if (username !== response.username || password !== response.password) {
            return {
                validUser: false
            } as UserInformation;
        }

        return {
            validUser: false
        } as UserInformation;
    } catch (error) {
        console.error("Retrieve User Error:", error);
        throw error;
    }
};

export const retrieveUser = async (
    username: string,
): Promise<UserInformation> => {
    try {
        const response = await dynamoClient.send(
            new QueryCommand({
                "ExpressionAttributeValues": {
                    ":username": {
                        "S": username
                    }
                },
                "IndexName": 'username-index',
                "KeyConditionExpression": "username = :username",
                "TableName": "Users"
            })
        );
        dynamoClient.destroy();

        if (response.Items) {
            const entity = response.Items[0] as UserEntry;

            return {
                username: entity.username.S ?? '',
                mainLanguage: entity.mainLanguage.S ?? '',
                savedVocabulary: typeof entity.savedVocabulary?.S !== 'undefined' && entity.savedVocabulary?.S ? JSON.parse(entity.savedVocabulary.S) as string[] : [],
                password: entity.password.S ?? '',
                createdDate: entity.createdDate.S ?? '',
                validUser: true
            };
        }

        return {
            validUser: false
        } as UserInformation;
    } catch (error) {
        console.error("Retrieve User Error:", error);
        throw error;
    }
};

export const createUser = async (
    username: string,
    password: string,
    email: string,
    mainLanguage: string,
    createdDate: Date
): Promise<boolean> => {
    try {
        const input: PutItemCommandInput = {
            "Item": {
                "username": {
                    "S": username
                },
                "password": {
                    "S": password
                },
                "email": {
                    "S": email
                },
                "mainLanguage": {
                    "S": mainLanguage
                },
                "createdDate": {
                    "S": createdDate.toString()
                }
            },
            "ReturnConsumedCapacity": "TOTAL",
            "TableName": "Users"
        };

        console.log(input);

        const command = new PutItemCommand(input);
        const response = await dynamoClient.send(command);

        dynamoClient.destroy();

        return true;
    } catch (error) {
        console.error("Create User Error:", error);
        throw error;
    }
};

export const saveUser = async (
    username: string,
    mainLanguage: string
): Promise<boolean> => {
    try {
        const existingRecord = await retrieveUser(username);
        const input: PutItemCommandInput = {
            "Item": {
                "username": {
                    "S": username ?? ''
                },
                "password": {
                    "S": existingRecord.password ?? ''
                },
                "email": {
                    "S": existingRecord.password ?? ''
                },
                "mainLanguage": {
                    "S": mainLanguage 
                },
                "createdDate": {
                    "S": existingRecord.createdDate ?? ''
                }
            },
            "ReturnConsumedCapacity": "TOTAL",
            "TableName": "Users"
        };

        const command = new PutItemCommand(input);
        const response = await dynamoClient.send(command);

        dynamoClient.destroy();

        return true;
    } catch (error) {
        console.error("Create User Error:", error);
        throw error;
    }
};