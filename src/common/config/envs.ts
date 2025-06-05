import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    JWT_SECRET: string;
    JWT_EXPIRATION: string;
}

const envsSchema = joi.object({
    PORT: joi.number().default(3000),
    DB_HOST: joi.string().default('localhost'),
    DB_PORT: joi.number().default(3306),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRATION: joi.string().default('1h'),
}).unknown(true);
 
const { error, value } = envsSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    database: {
        host: envVars.DB_HOST,
        port: envVars.DB_PORT,
        username: envVars.DB_USERNAME,
        password: envVars.DB_PASSWORD,
        database: envVars.DB_DATABASE,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        expiresIn: envVars.JWT_EXPIRATION,
    }
}