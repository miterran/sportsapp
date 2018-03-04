import periodTypes from '../utils/lists/periodTypes';
import sportTypes from '../utils/lists/sportTypes';
import _ from 'lodash';
import mongoose from 'mongoose';
import moment from 'moment';
import config from '../config';

const Schema = mongoose.Schema;

const isOddPointHasQuarter = point => Math.abs(point) % 1 === 0.25 || Math.abs(point) % 1 === 0.75;

const initialOdd = {
	awayMoneyLine: null,
	homeMoneyLine: null,
	awaySpreadPoint: null,
	awaySpreadLine: null,
	homeSpreadPoint: null,
	homeSpreadLine: null,
	totalOverPoint: null,
	totalOverLine: null,
	totalUnderPoint: null,
	totalUnderLine: null,
	drawLine: null,
};

const EventSchema = new Schema({
	ID: { type: String, required: true },
	uniqueID: { type: String, required: true, unique: true },
	provider: { type: String, required: true },
	bookmaker: { type: String, required: true },
	sport: { type: String, enum: sportTypes, required: true },
	period: { type: String, enum: periodTypes, required: true },
	league: { type: String, required: true },
	region: { type: String },
	matchTime: { type: Date, required: true },
	isPicked: { type: Boolean, default: false, required: true },
	team: {
		home: { type: String, required: true },
		homeROT: { type: String, required: true },
		homePitcher: { type: String },
		away: { type: String, required: true },
		awayROT: { type: String, required: true },
		awayPitcher: { type: String }
	},
	score: {
		home: { type: Number },
		away: { type: Number },
	},
	odd: {
		awayMoneyLine: { type: Number },
		homeMoneyLine: { type: Number },
		awaySpreadPoint: { type: Number },
		awaySpreadLine: { type: Number },
		homeSpreadPoint: { type: Number },
		homeSpreadLine: { type: Number },
		totalOverPoint: { type: Number },
		totalOverLine: { type: Number },
		totalUnderPoint: { type: Number },
		totalUnderLine: { type: Number },
		drawLine: { type: Number },
	},
	cutOffAt: { type: Date, required: true },
	isFinished: { type: Boolean, default: false, required: true },
	status: { type: String, enum: [ 'Pending', 'Finished', 'Cancelled', 'Postponed', 'Review' ], default: 'Pending', required: true },
	updatedAt: { type: Date, default: Date.now, required: true },
});

class EventClass {
	static deleteExpiredUnpickEvents(){
		return this.deleteMany({ isPicked: { $exists: false }, cutOffAt: { $lt: moment() } });
	}
	get teamLogo(){
		const url = config.HOSTURL
		return {
			away: `${url}/images/teamlogos/${this.team.away.split(' ').join('_').toLowerCase().replace(/\.|\'|\&/g, '')}.png`,
			home: `${url}/images/teamlogos/${this.team.home.split(' ').join('_').toLowerCase().replace(/\.|\'|\&/g, '')}.png`,
			default: `${url}/images/teamlogos/${this.sport.toLowerCase()}.png`
		};
	}
	get title () { return `${this.sport} - ${this.region ? this.region + ' - ' : '' }${this.league}`.toUpperCase(); }
	get finishedAt () { if(this.isFinished) return this.updatedAt; return null; }
	get isOddExpired() { return moment().isAfter(moment(this.cutOffAt)); }
	get actionOdd() { return this.oddWithAction; }
	get isActionOddActivate() { 
		const actionOdds = Object.values(this.oddWithAction);
		actionOdds.shift();
		return !_.isEmpty(_.compact(Object.values(actionOdds)));
	}
	set action(action){
		
		const {
			awayMoneyLine,
			homeMoneyLine,
			awaySpreadPoint,
			awaySpreadLine,
			homeSpreadPoint,
			homeSpreadLine,
			totalOverPoint,
			totalOverLine,
			totalUnderPoint,
			totalUnderLine,
			drawLine,
		} = this.odd;

		const isMoneyActivate = ( awayMoneyLine !== 0 && awayMoneyLine !== null && homeMoneyLine !== 0 && homeMoneyLine !== null );
		const isSpreadActivate = ( awaySpreadLine !== 0 && awaySpreadLine !== null && homeSpreadLine !== 0 && homeSpreadLine !== null );
		const isTotalActivate = ( totalOverLine !== 0 && totalOverLine !== null && totalUnderLine !== 0 &&totalUnderLine !== null );
		const isDrawActivate = ( drawLine !== 0 && drawLine !== null );

		switch(action){
		case 'straight':
			this.oddWithAction = this.odd;
			return;
		case 'actionReverse':
		case 'winReverse':
		case 'parlay':
			if(this.sport !== 'Fighting' && this.sport !== 'ESports'){
				this.oddWithAction = {
					awayMoneyLine: isMoneyActivate ? awayMoneyLine : null,
					homeMoneyLine: isMoneyActivate ? homeMoneyLine : null,
					awaySpreadPoint: isSpreadActivate ? (isOddPointHasQuarter(awaySpreadPoint) ? null : awaySpreadPoint) : null,
					awaySpreadLine: isSpreadActivate ? (isOddPointHasQuarter(awaySpreadPoint) ? null : awaySpreadLine) : null,
					homeSpreadPoint: isSpreadActivate ? (isOddPointHasQuarter(homeSpreadPoint) ? null : homeSpreadPoint) : null,
					homeSpreadLine: isSpreadActivate ? (isOddPointHasQuarter(homeSpreadPoint) ? null : homeSpreadLine) : null,
					totalOverPoint: isTotalActivate ? (isOddPointHasQuarter(totalOverPoint) ? null : totalOverPoint) : null,
					totalOverLine: isTotalActivate ? (isOddPointHasQuarter(totalOverPoint) ? null : totalOverLine) : null,
					totalUnderPoint: isTotalActivate ? (isOddPointHasQuarter(totalUnderPoint) ? null : totalUnderPoint) : null,
					totalUnderLine: isTotalActivate ? (isOddPointHasQuarter(totalUnderPoint) ? null : totalUnderLine) : null,
					drawLine: isDrawActivate ? drawLine : null,
				};
				return;
			}
			this.oddWithAction = initialOdd;
			return;
		case 'basicTeaser':
			if(this.period === 'Full Game'){
				if(this.sport === 'Basketball' && (this.league === 'NBA' || this.league === 'NCAAB' || this.league === 'WNBA')){
					this.oddWithAction = {
						awayMoneyLine: null,
						homeMoneyLine: null,
						awaySpreadPoint: isSpreadActivate ? awaySpreadPoint + 4 : null,
						awaySpreadLine: null,
						homeSpreadPoint: isSpreadActivate ? homeSpreadPoint + 4 : null,
						homeSpreadLine: null,
						totalOverPoint: isTotalActivate ? totalOverPoint - 4 : null,
						totalOverLine: null,
						totalUnderPoint: isTotalActivate ? totalUnderPoint + 4 : null,
						totalUnderLine: null,
						drawLine: null,
					};
					return;
				}
				if(this.sport === 'Football' && (this.league === 'NFL' || this.league === 'NCAAF' || this.league === 'CFL')){
					this.oddWithAction = {
						awayMoneyLine: null,
						homeMoneyLine: null,
						awaySpreadPoint: isSpreadActivate ? awaySpreadPoint + 6 : null,
						awaySpreadLine: null,
						homeSpreadPoint: isSpreadActivate ? homeSpreadPoint + 6 : null,
						homeSpreadLine: null,
						totalOverPoint: isTotalActivate ? totalOverPoint - 6 : null,
						totalOverLine: null,
						totalUnderPoint: isTotalActivate ? totalUnderPoint + 6 : null,
						totalUnderLine: null,
						drawLine: null,
					};
					return;
				}
			}
			this.oddWithAction = initialOdd;
			return;
		case 'specialTeaser':
			if(this.period === 'Full Game'){
				if(this.sport === 'Basketball' && (this.league === 'NBA' || this.league === 'NCAAB' || this.league === 'WNBA')){
					this.oddWithAction = {
						awayMoneyLine: null,
						homeMoneyLine: null,
						awaySpreadPoint: isSpreadActivate ? awaySpreadPoint + 4.5 : null,
						awaySpreadLine: null,
						homeSpreadPoint: isSpreadActivate ? homeSpreadPoint + 4.5 : null,
						homeSpreadLine: null,
						totalOverPoint: isTotalActivate ? totalOverPoint - 4.5 : null,
						totalOverLine: null,
						totalUnderPoint: isTotalActivate ? totalUnderPoint + 4.5 : null,
						totalUnderLine: null,
						drawLine: null,
					};
					return;
				}
				if(this.sport === 'Football' && (this.league === 'NFL' || this.league === 'NCAAF' || this.league === 'CFL')){
					this.oddWithAction = {
						awayMoneyLine: null,
						homeMoneyLine: null,
						awaySpreadPoint: isSpreadActivate ? awaySpreadPoint + 6.5 : null,
						awaySpreadLine: null,
						homeSpreadPoint: isSpreadActivate ? homeSpreadPoint + 6.5 : null,
						homeSpreadLine: null,
						totalOverPoint: isTotalActivate ? totalOverPoint - 6.5 : null,
						totalOverLine: null,
						totalUnderPoint: isTotalActivate ? totalUnderPoint + 6.5 : null,
						totalUnderLine: null,
						drawLine: null,
					};
					return;
				}
			}
			this.oddWithAction = initialOdd;
			return;
		case 'bigTeaser':
			if(this.period === 'Full Game'){
				if(this.sport === 'Basketball' && (this.league === 'NBA' || this.league === 'NCAAB' || this.league === 'WNBA')){
					this.oddWithAction = {
						awayMoneyLine: null,
						homeMoneyLine: null,
						awaySpreadPoint: isSpreadActivate ? awaySpreadPoint + 5 : null,
						awaySpreadLine: null,
						homeSpreadPoint: isSpreadActivate ? homeSpreadPoint + 5 : null,
						homeSpreadLine: null,
						totalOverPoint: isTotalActivate ? totalOverPoint - 5 : null,
						totalOverLine: null,
						totalUnderPoint: isTotalActivate ? totalUnderPoint + 5 : null,
						totalUnderLine: null,
						drawLine: null,
					};
					return;
				}
				if(this.sport === 'Football' && (this.league === 'NFL' || this.league === 'NCAAF' || this.league === 'CFL')){
					this.oddWithAction = {
						awayMoneyLine: null,
						homeMoneyLine: null,
						awaySpreadPoint: isSpreadActivate ? awaySpreadPoint + 7 : null,
						awaySpreadLine: null,
						homeSpreadPoint: isSpreadActivate ? homeSpreadPoint + 7 : null,
						homeSpreadLine: null,
						totalOverPoint: isTotalActivate ? totalOverPoint - 7 : null,
						totalOverLine: null,
						totalUnderPoint: isTotalActivate ? totalUnderPoint + 7 : null,
						totalUnderLine: null,
						drawLine: null,
					};
					return;
				}
			}
			this.oddWithAction = initialOdd;
			return;
		case 'superTeaser':
			if(this.period === 'Full Game'){
				if(this.sport === 'Basketball' && (this.league === 'NBA' || this.league === 'NCAAB' || this.league === 'WNBA')){
					this.oddWithAction = {
						awayMoneyLine: null,
						homeMoneyLine: null,
						awaySpreadPoint: isSpreadActivate ? awaySpreadPoint + 7 : null,
						awaySpreadLine: null,
						homeSpreadPoint: isSpreadActivate ? homeSpreadPoint + 7 : null,
						homeSpreadLine: null,
						totalOverPoint: isTotalActivate ? totalOverPoint - 7 : null,
						totalOverLine: null,
						totalUnderPoint: isTotalActivate ? totalUnderPoint + 7 : null,
						totalUnderLine: null,
						drawLine: null,
					};
					return;
				}
				if(this.sport === 'Football' && (this.league === 'NFL' || this.league === 'NCAAF' || this.league === 'CFL')){
					this.oddWithAction = {
						awayMoneyLine: null,
						homeMoneyLine: null,
						awaySpreadPoint: isSpreadActivate ? awaySpreadPoint + 10 : null,
						awaySpreadLine: null,
						homeSpreadPoint: isSpreadActivate ? homeSpreadPoint + 10 : null,
						homeSpreadLine: null,
						totalOverPoint: isTotalActivate ? totalOverPoint - 10 : null,
						totalOverLine: null,
						totalUnderPoint: isTotalActivate ? totalUnderPoint + 10 : null,
						totalUnderLine: null,
						drawLine: null,
					};
					return;
				}
			}
			this.oddWithAction = initialOdd;
			return;
		default: 
			this.oddWithAction = initialOdd;
			return;
		}
	}
}

EventSchema.loadClass(EventClass);


const Event = mongoose.model('Event', EventSchema);

export default Event;