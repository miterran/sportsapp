'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.dirname = undefined;

require('babel-polyfill');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _apolloServerExpress = require('apollo-server-express');

var _graphql = require('graphql');

var _subscriptionsTransportWs = require('subscriptions-transport-ws');

var _schema = require('./graphql/schema');

var _schema2 = _interopRequireDefault(_schema);

var _addUserToReq = require('./middleware/addUserToReq');

var _addUserToReq2 = _interopRequireDefault(_addUserToReq);

var _updateEvents = require('./queues/updateEvents');

var _updateEvents2 = _interopRequireDefault(_updateEvents);

var _pickMon = require('./services/updateScores/pickMon');

var _pickMon2 = _interopRequireDefault(_pickMon);

var _jsonOdd = require('./services/updateScores/jsonOdd');

var _jsonOdd2 = _interopRequireDefault(_jsonOdd);

var _updatePicks = require('./services/updatePicks');

var _updatePicks2 = _interopRequireDefault(_updatePicks);

var _updateBetOrders = require('./services/updateBetOrders');

var _updateBetOrders2 = _interopRequireDefault(_updateBetOrders);

var _Event = require('./models/Event');

var _Event2 = _interopRequireDefault(_Event);

var _User = require('./models/User.Player');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var dirname = exports.dirname = __dirname;
_mongoose2.default.connect(_config2.default.mongoURL);
_mongoose2.default.Promise = _bluebird2.default;

var app = (0, _express2.default)();

app.use((0, _morgan2.default)('dev'));
app.use((0, _cors2.default)());
app.use((0, _helmet2.default)());
app.use((0, _compression2.default)());
app.use((0, _methodOverride2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

app.use('/images/teamlogos', _express2.default.static(_path2.default.join(__dirname, '/public/images/teamlogos/baseball')));
app.use('/images/teamlogos', _express2.default.static(_path2.default.join(__dirname, '/public/images/teamlogos/basketball')));
app.use('/images/teamlogos', _express2.default.static(_path2.default.join(__dirname, '/public/images/teamlogos/football')));
app.use('/images/teamlogos', _express2.default.static(_path2.default.join(__dirname, '/public/images/teamlogos/ncaa')));
app.use('/images/teamlogos', _express2.default.static(_path2.default.join(__dirname, '/public/images/teamlogos/hockey')));
app.use('/images/teamlogos', _express2.default.static(_path2.default.join(__dirname, '/public/images/teamlogos/sport')));
app.use('/images/background', _express2.default.static(_path2.default.join(__dirname, '/public/images/background')));
app.use('/images/logo', _express2.default.static(_path2.default.join(__dirname, '/public/images/logo')));
app.use('/images/sports', _express2.default.static(_path2.default.join(__dirname, '/public/images/sports')));

app.get('/hi', function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						res.json('hi');

					case 1:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

var userCounter = [];

_nodeSchedule2.default.scheduleJob('*/' + _config2.default.UPDATE_ODD_MIN + ' * * * *', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
	return regeneratorRuntime.wrap(function _callee2$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					// eslint-disable-next-line
					console.log('scheduleJob usercounter', (0, _moment2.default)(), 'online users ' + userCounter.length);

					if (!(userCounter.length > 0)) {
						_context2.next = 4;
						break;
					}

					_context2.next = 4;
					return (0, _updateEvents2.default)();

				case 4:
				case 'end':
					return _context2.stop();
			}
		}
	}, _callee2, undefined);
})));
_nodeSchedule2.default.scheduleJob('*/15 * * * *', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
	return regeneratorRuntime.wrap(function _callee3$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					_context3.next = 2;
					return (0, _jsonOdd2.default)();

				case 2:
					_context3.next = 4;
					return (0, _pickMon2.default)();

				case 4:
					_context3.next = 6;
					return (0, _updatePicks2.default)();

				case 6:
					_context3.next = 8;
					return (0, _updateBetOrders2.default)();

				case 8:
					_context3.next = 10;
					return _Event2.default.deleteExpiredUnpickEvents();

				case 10:
					_context3.next = 12;
					return _User2.default.resetWeeklyBalanceToZero();

				case 12:
				case 'end':
					return _context3.stop();
			}
		}
	}, _callee3, undefined);
})));

app.use(_addUserToReq2.default);

app.use('/graphql', (0, _apolloServerExpress.graphqlExpress)(function (req) {
	return {
		schema: _schema2.default,
		context: { user: req.user }
	};
}));

app.use('/graphiql', (0, _apolloServerExpress.graphiqlExpress)({
	endpointURL: '/graphql',
	subscriptionsEndpoint: _config2.default.WSURL
}));

var ws = (0, _http.createServer)(app);

ws.listen(_config2.default.port, function () {
	console.log('Started on port ' + _config2.default.port);
	new _subscriptionsTransportWs.SubscriptionServer({
		execute: _graphql.execute,
		subscribe: _graphql.subscribe,
		schema: _schema2.default,
		onConnect: function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(connectionParams, webSocket) {
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								if (!userCounter.includes(webSocket.upgradeReq.headers['sec-websocket-key'])) {
									userCounter.push(webSocket.upgradeReq.headers['sec-websocket-key']);
								}
								// eslint-disable-next-line
								console.log(userCounter.length);

								if (!(userCounter.length === 1)) {
									_context4.next = 5;
									break;
								}

								_context4.next = 5;
								return (0, _updateEvents2.default)();

							case 5:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, undefined);
			}));

			return function onConnect(_x3, _x4) {
				return _ref4.apply(this, arguments);
			};
		}(),
		onDisconnect: function onDisconnect(webSocket) {
			userCounter = userCounter.filter(function (user) {
				return user !== webSocket.upgradeReq.headers['sec-websocket-key'];
			});
			//			eslint-disable-next-line
			console.log(userCounter.length);
		}
	}, {
		server: ws,
		path: '/subscriptions'
	});
});

exports.default = app;
//# sourceMappingURL=index.js.map