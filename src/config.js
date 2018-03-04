import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production', 'test', 'provision']).default('development'),
  PORT: Joi.number().default(8080),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string().required().description('JWT Secret required to sign'),
  MONGO_URL: Joi.string().required().description('Mongo DB host url'),
  JSONODD_API_KEY: Joi.string().required().description('JSON ODD API KEY'),
  PICKMON_UID: Joi.string().required().description('PICKMON UID'),
  PICKMON_KEY: Joi.string().required().description('PICKMON KEY'),
  HOSTURL: Joi.string().required().description('HOSTURL'),
  WSURL: Joi.string().required().description('WSURL'),
  GMAIL: Joi.string().required().description('GMAIL'),
  GPASSWORD: Joi.string().required().description('GPASSWORD'),
  MK: Joi.string().required().description('MK'),
  APPLE_KEY_ID: Joi.string().required().description('APPLE_KEY_ID'),
  APPLE_TEAM_ID: Joi.string().required().description('APPLE_TEAM_ID'),
  APN_TOPIC: Joi.string().required().description('APN_TOPIC'),
  UPDATE_ODD_MIN: Joi.string().required().description('update odd every ? min'),
  APPLE_PASSWORD: Joi.string().required().description('apple store password'),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  mongoURL: envVars.MONGO_URL,
  jsonOddApiKey: envVars.JSONODD_API_KEY,
  pickMon_UID: envVars.PICKMON_UID,
  pickMon_Key: envVars.PICKMON_KEY,
  HOSTURL: envVars.HOSTURL,
  WSURL: envVars.WSURL,
  GMAIL: envVars.GMAIL,
  GPASSWORD: envVars.GPASSWORD,
  MK: envVars.MK,
  APPLE_KEY_ID: envVars.APPLE_KEY_ID,
  APPLE_TEAM_ID: envVars.APPLE_TEAM_ID,
  APN_TOPIC: envVars.APN_TOPIC,
  UPDATE_ODD_MIN: envVars.UPDATE_ODD_MIN,
  APPLE_PASSWORD: envVars.APPLE_PASSWORD,
};

export default config;
