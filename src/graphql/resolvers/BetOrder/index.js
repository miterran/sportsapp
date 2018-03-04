import mongoose from 'mongoose';
import BetOrder from '../../../models/BetOrder';
import moment from 'moment';
import _ from 'lodash';

export const Query = {
	reviewBetOrders(root, req, ctx){
		return BetOrder.find({ status: 'review' }).populate({ path: 'Picks', populate: { path: 'Event' } }).populate('Agent').populate('Player')
	},
	betOrder(root, req){
		if(!req.BetOrder) return null;
		return BetOrder.findOne({ _id: mongoose.Types.ObjectId(req.BetOrder) })
			.populate({ path: 'Picks', populate: { path: 'Event' } })
			.populate({ path: 'Player', select: 'username'});
	},
	async betOrders(root, { Player, isClosed, startOfWeekNum, endOfWeekNum }, ctx){
		let query = { isClosed: isClosed };
		let sortByDate = isClosed ? 'updatedAt' : 'createdAt';
		if(ctx.user.role === 'Agent'){ query = Player === '' ? _.merge(query, { Agent: mongoose.Types.ObjectId(ctx.user._id) }) : _.merge(query, { Player: mongoose.Types.ObjectId(Player) }); }
		if(ctx.user.role === 'Player'){ query = _.merge(query, { Player: mongoose.Types.ObjectId(ctx.user._id) });}
		if(isClosed){
			if(!_.isNumber(startOfWeekNum)) throw new Error('Missing Start Of Week Num');
			if(!_.isNumber(endOfWeekNum)) throw new Error('Missing End Of Week Num');
			query = _.merge(query, { [sortByDate]: {$gte: moment().add(Number(startOfWeekNum), 'w').startOf('isoWeek'), $lte: moment().add(Number(endOfWeekNum), 'w').endOf('isoWeek') }});
		}
		return BetOrder.find(query).populate({ path: 'Player', select: 'username nickname'}).sort({ [sortByDate]: 'descending' });
	},
	async betOrdersOverview(root, { Player, isClosed, startOfWeekNum, endOfWeekNum }, ctx){
		let query = { isClosed: isClosed };
		let sortByDate = isClosed ? 'updatedAt' : 'createdAt';
		if(ctx.user.role === 'Agent'){ query = Player === '' ? _.merge(query, { Agent: mongoose.Types.ObjectId(ctx.user._id) }) : _.merge(query, { Player: mongoose.Types.ObjectId(Player) }); }
		if(ctx.user.role === 'Player'){ query = _.merge(query, { Player: mongoose.Types.ObjectId(ctx.user._id) });}
		if(isClosed){
			if(!_.isNumber(startOfWeekNum)) throw new Error('Missing Start Of Week Num');
			if(!_.isNumber(endOfWeekNum)) throw new Error('Missing End Of Week Num');
			query = _.merge(query, { [sortByDate]: {$gte: moment().add(Number(startOfWeekNum), 'w').startOf('isoWeek'), $lte: moment().add(Number(endOfWeekNum), 'w').endOf('isoWeek') }});
		}
		const betOrders = await BetOrder.find(query).populate({path: 'Picks', populate: { path: 'Event' }});
		const picks = _.flatten(betOrders.map(betOrder => betOrder.Picks.map(pick => pick)));

		//		const picks = await Pick.find(query).populate('Event')
		return {
			activePlayers: _.uniq(betOrders.map(betOrder => betOrder.Player.toString())).length,
			resultAmount: isClosed ? betOrders.reduce((sum, { resultAmount }) => sum + resultAmount, 0) : null,
			totalAtRisk: betOrders.reduce((sum, { bet: { atRisk } }) => sum + atRisk, 0),
			totalToWin: betOrders.reduce((sum, { bet: { toWin } }) => sum + toWin, 0),
			totalBets: betOrders.length,
			overview: {
				action: {
					straight: {
						Won: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'straight' && status === 'Won' ), 0),
						Lost: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'straight' && status === 'Lost' ), 0),
						Push: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'straight' && status === 'Push' ), 0),
						Pending: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'straight' && status === 'Pending' ), 0),
					},
					parlay: {
						Won: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'parlay' && status === 'Won' ), 0),
						Lost: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'parlay' && status === 'Lost' ), 0),
						Push: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'parlay' && status === 'Push' ), 0),
						Pending: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'parlay' && status === 'Pending' ), 0),
					},
					basicTeaser: {
						Won: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'basicTeaser' && status === 'Won' ), 0),
						Lost: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'basicTeaser' && status === 'Lost' ), 0),
						Push: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'basicTeaser' && status === 'Push' ), 0),
						Pending: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'basicTeaser' && status === 'Pending' ), 0),
					},
					specialTeaser: {
						Won: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'specialTeaser' && status === 'Won' ), 0),
						Lost: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'specialTeaser' && status === 'Lost' ), 0),
						Push: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'specialTeaser' && status === 'Push' ), 0),
						Pending: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'specialTeaser' && status === 'Pending' ), 0),
					},
					bigTeaser: {
						Won: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'bigTeaser' && status === 'Won' ), 0),
						Lost: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'bigTeaser' && status === 'Lost' ), 0),
						Push: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'bigTeaser' && status === 'Push' ), 0),
						Pending: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'bigTeaser' && status === 'Pending' ), 0),
					},
					superTeaser: {
						Won: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'superTeaser' && status === 'Won' ), 0),
						Lost: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'superTeaser' && status === 'Lost' ), 0),
						Push: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'superTeaser' && status === 'Push' ), 0),
						Pending: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'superTeaser' && status === 'Pending' ), 0),
					},
					winReverse: {
						Won: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'winReverse' && status === 'Won' ), 0),
						Lost: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'winReverse' && status === 'Lost' ), 0),
						Push: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'winReverse' && status === 'Push' ), 0),
						Pending: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'winReverse' && status === 'Pending' ), 0),
					},
					actionReverse: {
						Won: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'actionReverse' && status === 'Won' ), 0),
						Lost: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'actionReverse' && status === 'Lost' ), 0),
						Push: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'actionReverse' && status === 'Push' ), 0),
						Pending: betOrders.reduce((sum, { status, bet: { action } }) => sum + (action === 'actionReverse' && status === 'Pending' ), 0),
					},
				},
				odd: {
					MLine: {
						Won: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'MLine' && status === 'Won' ), 0),
						Lost: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'MLine' && status === 'Lost' ), 0),
						Push: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'MLine' && status === 'Push' ), 0),
						Pending: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'MLine' && status === 'Pending' ), 0),
					},
					Spread: {
						Won: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'Spread' && status === 'Won' ), 0),
						Lost: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'Spread' && status === 'Lost' ), 0),
						Push: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'Spread' && status === 'Push' ), 0),
						Pending: picks.reduce((sum, { status, marked: { oddType } }) => sum + (oddType === 'Spread' && status === 'Pending' ), 0),
					},
					Total: {
						Won: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'Total' && status === 'Won' ), 0),
						Lost: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'Total' && status === 'Lost' ), 0),
						Push: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'Total' && status === 'Push' ), 0),
						Pending: picks.reduce((sum, { status, marked: { oddType } }) => sum + (oddType === 'Total' && status === 'Pending' ), 0),
					},
					Draw: {
						Won: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'Draw' && status === 'Won' ), 0),
						Lost: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'Draw' && status === 'Lost' ), 0),
						Push: picks.reduce((sum, { status, marked: { oddType } }) => sum + ( oddType === 'Draw' && status === 'Push' ), 0),
						Pending: picks.reduce((sum, { status, marked: { oddType } }) => sum + (oddType === 'Draw' && status === 'Pending' ), 0),
					}
				},
				sport: {
					Basketball: {
						Won: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Basketball' && status === 'Won' ), 0),
						Lost: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Basketball' && status === 'Lost' ), 0),
						Push: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Basketball' && status === 'Push' ), 0),
						Pending: picks.reduce((sum, { status, Event: { sport } }) => sum + (sport === 'Basketball' && status === 'Pending' ), 0),
					},
					Football: {
						Won: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Football' && status === 'Won' ), 0),
						Lost: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Football' && status === 'Lost' ), 0),
						Push: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Football' && status === 'Push' ), 0),
						Pending: picks.reduce((sum, { status, Event: { sport } }) => sum + (sport === 'Football' && status === 'Pending' ), 0),
					},
					Baseball: {
						Won: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Baseball' && status === 'Won' ), 0),
						Lost: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Baseball' && status === 'Lost' ), 0),
						Push: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Baseball' && status === 'Push' ), 0),
						Pending: picks.reduce((sum, { status, Event: { sport } }) => sum + (sport === 'Baseball' && status === 'Pending' ), 0),
					},
					Soccer: {
						Won: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Soccer' && status === 'Won' ), 0),
						Lost: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Soccer' && status === 'Lost' ), 0),
						Push: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Soccer' && status === 'Push' ), 0),
						Pending: picks.reduce((sum, { status, Event: { sport } }) => sum + (sport === 'Soccer' && status === 'Pending' ), 0),
					},
					Hockey: {
						Won: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Hockey' && status === 'Won' ), 0),
						Lost: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Hockey' && status === 'Lost' ), 0),
						Push: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Hockey' && status === 'Push' ), 0),
						Pending: picks.reduce((sum, { status, Event: { sport } }) => sum + (sport === 'Hockey' && status === 'Pending' ), 0),
					},
					Fighting: {
						Won: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Fighting' && status === 'Won' ), 0),
						Lost: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Fighting' && status === 'Lost' ), 0),
						Push: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'Fighting' && status === 'Push' ), 0),
						Pending: picks.reduce((sum, { status, Event: { sport } }) => sum + (sport === 'Fighting' && status === 'Pending' ), 0),
					},
					ESports: {
						Won: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'ESports' && status === 'Won' ), 0),
						Lost: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'ESports' && status === 'Lost' ), 0),
						Push: picks.reduce((sum, { status, Event: { sport } }) => sum + ( sport === 'ESports' && status === 'Push' ), 0),
						Pending: picks.reduce((sum, { status, Event: { sport } }) => sum + (sport === 'ESports' && status === 'Pending' ), 0),
					},
				}
			},
		};
	},
};
