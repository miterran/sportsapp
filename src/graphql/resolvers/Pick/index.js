import mongoose from 'mongoose';
import Pick from '../../../models/Pick';
import moment from 'moment'

export const Query = {
	pick(root, req){
		return Pick.findOne({ $or: [ { _id: mongoose.Types.ObjectId(req._id)}, { ID: req.ID } ] }).populate('Event').populate('BetOrder').populate('Agent').populate('Player');
	},
	picks(root, req){
		return Pick.find({ status: req.status }).populate('Event').populate('BetOrder').populate('Agent').populate('Player');
	}
};