import { UserInformation } from "@/models/users/userInformation";
import { retrieveUser } from "./dynamoDb/users";

export const GetUserInfo = async (): Promise<UserInformation | null> => {
    let data = localStorage.getItem('user');
    if (data) {
        const response = JSON.parse(data) as UserInformation;

        return await retrieveUser(response?.username ?? '', response?.password ?? '');
    }

    return null;
}