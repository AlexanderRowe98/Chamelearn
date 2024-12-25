import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    TRANSLATOR_AWS_ACCESS_KEY_ID: process.env.TRANSLATOR_AWS_ACCESS_KEY_ID,
    TRANSLATOR_AWS_SECRET_ACCESS_KEY: process.env.TRANSLATOR_AWS_SECRET_ACCESS_KEY,
    DYNAMODB_AWS_ACCESS_KEY_ID: process.env.DYNAMODB_AWS_ACCESS_KEY_ID,
    DYNAMODB_AWS_SECRET_ACCESS_KEY: process.env.DYNAMODB_AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION
  }
};

export default nextConfig;
