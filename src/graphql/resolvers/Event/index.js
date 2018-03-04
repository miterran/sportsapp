import mongoose from 'mongoose';
import Event from '../../../models/Event';
import moment from 'moment'
import config from '../../../config';

export const Query = {
	event(root, req){
		return Event.findOne({ $or: [ { _id: mongoose.Types.ObjectId(req._id)}, { ID: req.ID }] });
	},
	events(root, req){
		return Event.find(req);
	},
	reviewEvents(root, req){
		return Event.find({ $or: [ { status: 'Review', isPicked: true }, { isPicked: true, isFinished: false, matchTime: { $lte: moment().subtract(3, 'h') } }] });
	}
};

export const Mutation = {
	async manuallyUpdateEventResult(root, { _id, ID, MK, awayScore,homeScore, status }, ctx){
		const score = { away: awayScore, home:  homeScore }
		if(MK !== config.MK) return { title: 'Not Authenticated', content: 'Please try again.', status: 'danger' };
		const newEvent = await Event.findOneAndUpdate({ $or: [ { _id: mongoose.Types.ObjectId(_id)}, { ID: ID } ] }, { $set: { score: score, status: status, isFinished: true } }, { new: true })
		return newEvent
	}
}