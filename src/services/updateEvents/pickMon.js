import config from '../../config';
import Event from '../../models/Event';
import _ from 'lodash';
import xml2js from'xml2js-es6-promise';
import axios from 'axios';
import moment from 'moment';
import renameEventPeriod from '../../utils/functions/renameEventPeriod';
import renameLeague from '../../utils/functions/renameLeague';
import sportTypes from '../../utils/lists/sportTypes';
import Provider from '../../models/Provider';
import SystemLog from '../../models/SystemLog';
import LogoCollect from '../../models/LogoCollect';
import { dirname } from '../../index';
import fileExists from 'file-exists';

const updateEventOddFromPickMon = async () => {
	try {
		
		if(!await Provider.isActivate('pm')) return; 
		// eslint-disable-next-line
		console.log('update pickMon odd');
		const pickMonSport = await Provider.findOne({ name: 'pm' }).then(res => res.options.join(','));
		const pickMonXML = await axios.get(`https://api.pickmonitor.com/lines.php?uid=${config.pickMon_UID}&key=${config.pickMon_Key}&sports=${pickMonSport}&graded=0&full_call=1`).then(res => res.data);
		const pickMonEvents = await xml2js(pickMonXML, {explicitArray: false}).then(res => (res.hasOwnProperty('lines') && res.lines.hasOwnProperty('game')) ? res.lines.game : [] );
		if(_.isEmpty(pickMonEvents)) {
			// pm expired need to send notification !!
			return;
		}
		for( let event of pickMonEvents ) {
			const theSport = event.sporttype; 
			if(!sportTypes.includes(theSport)) continue;
			const thePeriod = renameEventPeriod(event.line.perioddesc); 
			if(thePeriod === 'unknow') continue;
			if(thePeriod !== 'Second Half') continue;
			
			const theMatchTime = moment.utc(event.gamedate).add(5, 'h'); if(moment().add(5, 'd').endOf('day').isBefore(theMatchTime)) continue;
			const theOddCutOffTime = moment.utc(event.line.wagercutoff).add(5, 'h'); 
			if(moment().isAfter(theOddCutOffTime)) continue;
			
			if(moment().add(1, 'h').isBefore(theOddCutOffTime)) continue;

			const theLeague = renameLeague(theSport, event.sportsubtype);
			const theAwayPitcher = theSport === 'Baseball' ? (!_.isEmpty(event.team1.pitcher) ? event.team1.pitcher : 'Action') : null;
			const theHomePitcher = theSport === 'Baseball' ? (!_.isEmpty(event.team2.pitcher) ? event.team2.pitcher : 'Action') : null;
			let theOddCutOffAt = theOddCutOffTime;
			if(thePeriod === 'Second Half'){ 
				const theExpectSecondHalfTime = moment(theMatchTime).add(1, 'h').add(45, 'm');
				const isSecondHalfOnTime = moment(theExpectSecondHalfTime).isAfter(theOddCutOffTime); // return true: Yes its onTime. false: use expect time
				theOddCutOffAt = isSecondHalfOnTime ? theOddCutOffTime : theExpectSecondHalfTime;
			}
			const theSpreadPoint = Number(event.line.spread.points);
			const isSpreadPointPositive = theSpreadPoint > 0;
			const theHomeSpreadPoint = theSpreadPoint;
			const theAwaySpreadPoint = isSpreadPointPositive ? -Number(theSpreadPoint) : Math.abs(theSpreadPoint);
			const theAwayROT = event.team1.rotnum.toString();
			const theHomeROT = event.team2.rotnum.toString();
			const theUniqueID = `${moment(theMatchTime).format('MMDDYY')}_${theAwayROT}_${theHomeROT}_${theSport}_${thePeriod.replace(/\s/g,'')}`;
			
			//
			const awayLogo = {
				name: event.team1.name.split(' ').join('_').toLowerCase().replace(/\.|\'|\&/g, ''),
				team: event.team1.name,
				sport: theSport,
				league: theLeague,
				region: null,
				detail: `${event.team1.name} ${theAwayROT} vs ${event.team2.name} ${theHomeROT}`
			};
			const homeLogo = {
				name: event.team2.name.split(' ').join('_').toLowerCase().replace(/\.|\'|\&/g, ''),
				team: event.team2.name,
				sport: theSport,
				league: theLeague,
				region: null,
				detail: `${event.team1.name} ${theAwayROT} vs ${event.team2.name} ${theHomeROT}`
			};

			const folderName = (theLeague === 'NCAAB' || theLeague === 'NCAAF') ? 'NCAA' : theSport;

			const awayLogoExists = await fileExists(dirname + `/public/images/teamlogos/${folderName}/${awayLogo.name}.png`);
			if(!awayLogoExists) { await LogoCollect.findOneAndUpdate({ name: awayLogo.name }, awayLogo, { upsert: true }); }
			const homeLogoExists = await fileExists(dirname + `/public/images/teamlogos/${folderName}/${homeLogo.name}.png`);
			if(!homeLogoExists) { await LogoCollect.findOneAndUpdate({ name: homeLogo.name }, homeLogo, { upsert: true }); }
			//

			let newEvent = {
				ID: event.id,
				uniqueID: theUniqueID,
				provider: 'pm',
				bookmaker: 'pm',
				sport: theSport,
				period: thePeriod,
				league: theLeague,
				region: null,
				matchTime: moment(theMatchTime),
				team: {
					away: event.team1.name,
					awayROT: theAwayROT,
					awayPitcher: theAwayPitcher,
					home: event.team2.name,
					homeROT: theHomeROT,
					homePitcher: theHomePitcher,
				},
				score: {
					home: null,
					away: null,
				},
				odd: {
					awayMoneyLine: Number(event.line.money.team1) || null,
					awaySpreadPoint: Number(theAwaySpreadPoint) || null,
					awaySpreadLine: Number(event.line.spread.team1) || null,
					homeMoneyLine: Number(event.line.money.team2) || null,
					homeSpreadPoint: Number(theHomeSpreadPoint) || null,
					homeSpreadLine: Number(event.line.spread.team2) || null,
					totalOverPoint: Number(event.line.total.points) || null,
					totalOverLine: Number(event.line.total.over) || null,
					totalUnderPoint: Number(event.line.total.points) || null,
					totalUnderLine: Number(event.line.total.under) || null,
					drawLine: Number(event.line.money.draw) || null,
					
				},
				cutOffAt: moment(theOddCutOffAt),
				isFinished: false,
				status: 'Pending',
				updatedAt: moment(),
			};
			await Event.findOneAndUpdate({ uniqueID: newEvent.uniqueID, status: 'Pending' }, newEvent, { upsert: true });
		}
	} catch (e) {
		await SystemLog.create({ title: 'update pick mon event failed', content: `${e}`, status: 'danger'});
	}

};

export default updateEventOddFromPickMon;