import AWS from "aws-sdk";

const translate = new AWS.Translate({
  region: "eu-west-2", // Replace with your AWS region
  accessKeyId: process.env.TRANSLATOR_AWS_ACCESS_KEY_ID, // Set in .env.local
  secretAccessKey: process.env.TRANSLATOR_AWS_SECRET_ACCESS_KEY, // Set in .env.local
});

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  try {
    const params: AWS.Translate.Types.TranslateTextRequest = {
      Text: text,
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
    };
    const result = await translate.translateText(params).promise();
    return result.TranslatedText || "";
  } catch (error) {
    console.error("Translation Error:", error);
    throw error;
  }
};
