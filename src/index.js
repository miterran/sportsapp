import 'babel-polyfill';
import config from './config';
import moment from 'moment';
import express from 'express';
import path from 'path';
import { createServer } from 'http';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compress from 'compression';
import helmet from 'helmet';
import methodOverride from 'method-override';

import schedule from 'node-schedule';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import schema from './graphql/schema';

import addUserToReq from './middleware/addUserToReq';

import updateEvents from './queues/updateEvents';

import updateScoreFromPickMon from './services/updateScores/pickMon';
import updateScoreFromJsonOdd from './services/updateScores/jsonOdd';
import updatePicks from './services/updatePicks';
import updateBetOrders from './services/updateBetOrders';
import Event from './models/Event';
import Player from './models/User.Player';

export const dirname = __dirname;
mongoose.connect(config.mongoURL);
mongoose.Promise = bluebird;

let app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/images/teamlogos', express.static(path.join(__dirname, '/public/images/teamlogos/baseball')));
app.use('/images/teamlogos', express.static(path.join(__dirname, '/public/images/teamlogos/basketball')));
app.use('/images/teamlogos', express.static(path.join(__dirname, '/public/images/teamlogos/football')));
app.use('/images/teamlogos', express.static(path.join(__dirname, '/public/images/teamlogos/ncaa')));
app.use('/images/teamlogos', express.static(path.join(__dirname, '/public/images/teamlogos/hockey')));
app.use('/images/teamlogos', express.static(path.join(__dirname, '/public/images/teamlogos/sport')));
app.use('/images/background', express.static(path.join(__dirname, '/public/images/background')));
app.use('/images/logo', express.static(path.join(__dirname, '/public/images/logo')));
app.use('/images/sports', express.static(path.join(__dirname, '/public/images/sports')));

app.get('/hi', async (req, res) => {
	res.json('hi')
})

let userCounter = [];

schedule.scheduleJob(`*/${config.UPDATE_ODD_MIN} * * * *`, async () => {
	// eslint-disable-next-line
	console.log('scheduleJob usercounter', moment(), 'online users ' + userCounter.length);
	if(userCounter.length > 0){
		await updateEvents();
	}
});
schedule.scheduleJob('*/15 * * * *', async () => {
	await updateScoreFromJsonOdd();
	await updateScoreFromPickMon();
	await updatePicks();
	await updateBetOrders();
	await Event.deleteExpiredUnpickEvents();
	await Player.resetWeeklyBalanceToZero();
});

app.use(addUserToReq);

app.use('/graphql', 
	graphqlExpress((req) => ({
		schema, 
		context: { user: req.user }
	}))
);

app.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql', 
	subscriptionsEndpoint: config.WSURL
}));

const ws = createServer(app);

ws.listen(config.port, () => { 
	console.log(`Started on port ${config.port}`) 
	new SubscriptionServer({
		execute,
		subscribe,
		schema,
		onConnect: async (connectionParams, webSocket) => {
			if(!userCounter.includes(webSocket.upgradeReq.headers['sec-websocket-key'])) {
				userCounter.push(webSocket.upgradeReq.headers['sec-websocket-key']);
			}
			// eslint-disable-next-line
			console.log(userCounter.length);
			if(userCounter.length === 1){ 
				await updateEvents()
			}
		},
		onDisconnect: (webSocket) => {
			userCounter = userCounter.filter(user => user !== webSocket.upgradeReq.headers['sec-websocket-key']);
//			eslint-disable-next-line
			console.log(userCounter.length);
		},
	}, {
		server: ws,
		path: '/subscriptions',
	});
});


export default app;