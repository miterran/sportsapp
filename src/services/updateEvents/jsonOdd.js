import config from '../../config';
import Event from '../../models/Event';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import renameEventPeriod from '../../utils/functions/renameEventPeriod';
import SystemLog from '../../models/SystemLog';
import Provider from '../../models/Provider';
import LogoCollect from '../../models/LogoCollect';

import { dirname } from '../../index';
import fileExists from 'file-exists';


const axiosJsonOdd = axios.create({ headers: {'x-api-key': config.jsonOddApiKey}});

const updateEventOddFromJsonOdd = async () => {
	try{
		if(!await Provider.isActivate('jo')) return; 
		//eslint-disable-next-line
		console.log('update jsonOdd odd');
		const jsonOddSports = await Provider.findOne({ name: 'jo' }).then(res => res.options);
											
		const nba = await axiosJsonOdd.get('https://jsonodds.com/api/odds/nba?source=4').then(res => res.data.map(event => ({ ...event, Odds: event.Odds.filter(odd => odd.OddType !== 'Game' ) }) )).catch(() => []);
		const nbaFull = await axiosJsonOdd.get('https://jsonodds.com/api/odds/nba?source=8').then(res => res.data.map(event => ({ ...event, Odds: event.Odds.filter(odd => odd.OddType === 'Game' ) })  )).catch(() => []);
		const allSports = await axiosJsonOdd.get('https://jsonodds.com/api/odds?source=3').then(res => res.data.filter(event => event.Sport !== 1 )).catch(() => []);

		const jsonEvents = allSports.concat(nba).concat(nbaFull)

		if(_.isEmpty(jsonEvents)) return;
		for( let event of jsonEvents ) {
			const jsonSport = _.find(jsonOddSports, { idx: event.Sport, activate: true } );
			if(!jsonSport) continue;
			const theSport = jsonSport.sport;
			const theMatchTime = moment.utc(event.MatchTime);
			if(moment().add(5, 'days').endOf('day').isBefore(theMatchTime)) continue;
			if(moment().isAfter(theMatchTime)) continue;
			if(moment().add(5, 'd').endOf('day').isBefore(theMatchTime)) continue;
			const theLeague = event.Sport === 7 ? ( event.hasOwnProperty('League') && event.League.hasOwnProperty('Name') ? event.League.Name : '' ) : jsonSport.league;
			if(theLeague === '') continue;
			const theRegion = event.Sport === 7 ? event.DisplayRegion : null;
			const theAwayPitcher = theSport === 'Baseball' ? (!_.isEmpty(event.AwayPitcher) ? event.AwayPitcher : 'Action') : null;
			const theHomePitcher = theSport === 'Baseball' ? (!_.isEmpty(event.HomePitcher) ? event.HomePitcher : 'Action') : null;
			const theAwayROT = event.AwayROT;
			const theHomeROT = event.HomeROT;

			//
			const awayLogo = {
				name: event.AwayTeam.split(' ').join('_').toLowerCase().replace(/\.|\'|\&/g, ''),
				team: event.AwayTeam,
				sport: theSport,
				league: theLeague,
				region: theRegion,
				detail: `${event.AwayTeam} ${theAwayROT} vs ${event.HomeTeam} ${theHomeROT}`
			};
			const homeLogo = {
				name: event.HomeTeam.split(' ').join('_').toLowerCase().replace(/\.|\'|\&/g, ''),
				team: event.HomeTeam,
				sport: theSport,
				league: theLeague,
				region: theRegion,
				detail: `${event.AwayTeam} ${theAwayROT} vs ${event.HomeTeam} ${theHomeROT}`
			};

			const folderName = (theLeague === 'NCAAB' || theLeague === 'NCAAF') ? 'NCAA' : theSport;

			const awayLogoExists = await fileExists(dirname + `/public/images/teamlogos/${folderName}/${awayLogo.name}.png`);
			if(!awayLogoExists) { await LogoCollect.findOneAndUpdate({ name: awayLogo.name }, awayLogo, { upsert: true }); }
			const homeLogoExists = await fileExists(dirname + `/public/images/teamlogos/${folderName}/${homeLogo.name}.png`);
			if(!homeLogoExists) { await LogoCollect.findOneAndUpdate({ name: homeLogo.name }, homeLogo, { upsert: true }); }
			//


			for( let odd of event.Odds ) {
				const thePeriod = renameEventPeriod(odd.OddType); if(thePeriod === 'unknow') continue;
				const theUniqueID = `${moment(theMatchTime).format('MMDDYY')}_${theAwayROT}_${theHomeROT}_${theSport}_${thePeriod.replace(/\s/g,'')}`;
				let newEvent = {
					ID: odd.ID,
					uniqueID: theUniqueID,
					provider: 'jo',
					bookmaker: odd.SiteID.toString(),
					sport: theSport,
					period: thePeriod,
					league: theLeague,
					region: theRegion,
					matchTime: theMatchTime,
					team: {
						away: event.AwayTeam,
						awayROT: theAwayROT,
						awayPitcher: theAwayPitcher,
						home: event.HomeTeam,
						homeROT: theHomeROT,
						homePitcher: theHomePitcher,
					},
					score: {
						home: null,
						away: null,
					},
					odd: {
						awayMoneyLine: Number(odd.MoneyLineAway) || null,
						awaySpreadPoint: Number(odd.PointSpreadAway) || null,
						awaySpreadLine: Number(odd.PointSpreadAwayLine) || null,
						homeMoneyLine: Number(odd.MoneyLineHome) || null,
						homeSpreadPoint: Number(odd.PointSpreadHome) || null,
						homeSpreadLine: Number(odd.PointSpreadHomeLine) || null,
						totalOverPoint: Number(odd.TotalNumber) || null,
						totalOverLine: Number(odd.OverLine) || null,
						totalUnderPoint: Number(odd.TotalNumber) || null,
						totalUnderLine: Number(odd.UnderLine) || null,
						drawLine: Number(odd.DrawLine) || null ,
					},
					cutOffAt: moment(theMatchTime),
					isFinished: false,
					status: 'Pending',
					updatedAt: moment(),
				};
				await Event.findOneAndUpdate({ uniqueID: newEvent.uniqueID }, newEvent, { upsert: true });
			}
		}
	} catch (e) {
		await SystemLog.create({ title: 'update json odd event failed', content: e, status: 'danger'});
	}
};

export default updateEventOddFromJsonOdd;