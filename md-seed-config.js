import config from './src/config';
import mongooseLib from 'mongoose';

mongooseLib.Promise = global.Promise;

import CooldownsSeeder from "./seeds/cooldowns.seeder";
import ProvidersSeeder from "./seeds/providers.seeder";
import TablesSeeder from "./seeds/tables.seeder";

// Export the mongoose lib
export const mongoose = mongooseLib;

// Export the mongodb url
export const mongoURL = config.mongoURL;

/*
  Seeders List
  ------
  order is important
*/
export const seedersList = {
	CooldownsSeeder,
	ProvidersSeeder,
	TablesSeeder
};
