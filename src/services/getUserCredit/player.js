import mongoose from 'mongoose'
import config from '../../config';
import Player from '../../models/User.Player';
import BetOrder from '../../models/BetOrder';
import moment from 'moment'

const getPlayerCurrentCredit = async (PlayerID) => {
	try {

		const initialCredit = await Player.findOne({ _id: mongoose.Types.ObjectId(PlayerID) }, 'wagerLimit.initialCredit').then(data => data.wagerLimit.initialCredit)
		const balance = await BetOrder.find({ Player: mongoose.Types.ObjectId(PlayerID), isClosed: true, updatedAt: {$gte: moment().startOf('isoWeek'), $lte: moment().endOf('isoWeek') } }, 'resultAmount')
						.then(orders => orders.map(order => order.resultAmount)).reduce((sum, amount) => sum + amount, 0)
		const pending = await BetOrder.find({ Player: mongoose.Types.ObjectId(PlayerID), isClosed: false, createdAt: {$gte: moment().startOf('isoWeek'), $lte: moment().endOf('isoWeek') } }, 'bet.atRisk')
						.then(orders => orders.map(order => order.bet.atRisk)).reduce((sum, amount) => sum + amount, 0)

		return { 
			initial: initialCredit,
			balance: balance,
			pending: pending,
			available: initialCredit + balance - pending
		}

	}catch(e){
		throw new Error(e)
	}

}

export default getPlayerCurrentCredit