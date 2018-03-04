import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../config';
import User from '../models/User';
import _ from 'lodash';

const addUserToReq = async (req, res, next) => {
	if(!req.headers || !req.headers.hasOwnProperty('authorization')) {
		req.user = { _id: '', username: '', role: 'Guest', createdAt: moment() };
		next();
	}
	const token = req.headers['authorization'];
	try {
		const decodeToken = jwt.verify(token, config.jwtSecret);
		const user = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(decodeToken._id) }, {$set: { lastOnlineAt: moment() }});
		req.user = _.pick(user, ['_id', 'username', 'role', 'createdAt']);
		next();
	} catch (e) {
		req.user = { _id: '', username: '', role: 'Error', createdAt: moment() };
		next();
	}
};

export default addUserToReq;