import periodTypes from '../utils/lists/periodTypes';
import sportTypes from '../utils/lists/sportTypes';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const periodSchema = new Schema({
	name: { type: String, enum: periodTypes }
});

const LeagueSchema = new Schema({
	name: { type: String },
	region: { type: String },
	periods: [periodSchema]
});

const SportSchema = new Schema({
	name: { type: String, enum: sportTypes },
	leagues: [LeagueSchema],
});

const TableSchema = new Schema({
	name: { type: String, enum: ['standard', 'modify', 'special'] },
	sports: [SportSchema]
});

const Table = mongoose.model('Table', TableSchema);

export default Table;



