import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LogoCollectSchema = new Schema({
	name: { type: String },
	team: { type: String },
	sport: { type: String },
	league: { type: String },
	region: { type: String },
	detail: { type: String },
});

const LogoCollect = mongoose.model('LogoCollect', LogoCollectSchema);

export default LogoCollect;