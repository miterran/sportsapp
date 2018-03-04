'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Mutation = exports.Query = undefined;

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

var _Table = require('../../../models/Table');

var _Table2 = _interopRequireDefault(_Table);

var _Event = require('../../../models/Event');

var _Event2 = _interopRequireDefault(_Event);

var _User = require('../../../models/User.Agent');

var _User2 = _interopRequireDefault(_User);

var _User3 = require('../../../models/User.Player');

var _User4 = _interopRequireDefault(_User3);

var _Pick = require('../../../models/Pick');

var _Pick2 = _interopRequireDefault(_Pick);

var _BetOrder = require('../../../models/BetOrder');

var _BetOrder2 = _interopRequireDefault(_BetOrder);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _uniqid = require('uniqid');

var _uniqid2 = _interopRequireDefault(_uniqid);

var _generateAtRiskToWin2 = require('../../../utils/functions/generateAtRiskToWin');

var _generateAtRiskToWin3 = _interopRequireDefault(_generateAtRiskToWin2);

var _renameActionToTable = require('../../../utils/functions/renameActionToTable');

var _renameActionToTable2 = _interopRequireDefault(_renameActionToTable);

var _renameActionFullName = require('../../../utils/functions/renameActionFullName');

var _renameActionFullName2 = _interopRequireDefault(_renameActionFullName);

var _sportTypes = require('../../../utils/lists/sportTypes');

var _sportTypes2 = _interopRequireDefault(_sportTypes);

var _periodTypes = require('../../../utils/lists/periodTypes');

var _periodTypes2 = _interopRequireDefault(_periodTypes);

var _minActionTeams = require('../../../utils/objects/minActionTeams');

var _minActionTeams2 = _interopRequireDefault(_minActionTeams);

var _updateEvents = require('../../../queues/updateEvents');

var _updateEvents2 = _interopRequireDefault(_updateEvents);

var _updateTables = require('../../../queues/updateTables');

var _updateTables2 = _interopRequireDefault(_updateTables);

var _SystemLog = require('../../../models/SystemLog');

var _SystemLog2 = _interopRequireDefault(_SystemLog);

var _player = require('../../../services/getUserCredit/player');

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import Transaction from '../../../models/Transaction';
// import PriceRate from '../../../models/PriceRate';

// import apnProvider from '../../../apn'
// import apn from 'apn'

var Query = exports.Query = {
	table: function table(root, req) {
		var _this = this;

		return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
			var table;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return (0, _updateTables2.default)();

						case 2:
							_context.next = 4;
							return _Table2.default.findOne({ name: (0, _renameActionToTable2.default)(req.action) });

						case 4:
							table = _context.sent;

							table.sports.sort(function (a, b) {
								return _sportTypes2.default.indexOf(a.name) - _sportTypes2.default.indexOf(b.name);
							});
							table.sports.map(function (sport) {
								return sport.leagues.map(function (league) {
									return league.periods.sort(function (a, b) {
										return _periodTypes2.default.indexOf(a.name) - _periodTypes2.default.indexOf(b.name);
									});
								});
							});
							return _context.abrupt('return', table);

						case 8:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, _this);
		}))();
	},
	actionEvents: function actionEvents(root, _ref) {
		var _this2 = this;

		var action = _ref.action,
		    tablePicks = _ref.tablePicks;
		return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							if (!_lodash2.default.isEmpty(tablePicks)) {
								_context2.next = 2;
								break;
							}

							return _context2.abrupt('return', []);

						case 2:
							return _context2.abrupt('return', _Event2.default.find({ $or: tablePicks, cutOffAt: { $gte: (0, _moment2.default)() }, status: 'Pending', isFinished: false }).sort({ cutOffAt: 1 }).then(function (events) {
								return _lodash2.default.compact(events.map(function (event) {
									event.action = action;if (event.isActionOddActivate) {
										return event;
									} else {
										return null;
									}
								}));
							}));

						case 3:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, _this2);
		}))();
	},
	wagerPicks: function wagerPicks(root, _ref2) {
		var _this3 = this;

		var action = _ref2.action,
		    eventOddPicks = _ref2.eventOddPicks;
		return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
			var eventIDs, events;
			return regeneratorRuntime.wrap(function _callee3$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							if (!_lodash2.default.isEmpty(eventOddPicks)) {
								_context3.next = 2;
								break;
							}

							return _context3.abrupt('return', []);

						case 2:
							//		await updateEvents()
							eventIDs = _lodash2.default.uniqBy(eventOddPicks.map(function (pick) {
								return { _id: _mongoose2.default.Types.ObjectId(pick.Event) };
							}), '_id');
							_context3.next = 5;
							return _Event2.default.find({ $or: eventIDs }).then(function (events) {
								return events.map(function (event) {
									event.action = action;return event;
								});
							});

						case 5:
							events = _context3.sent;
							return _context3.abrupt('return', eventOddPicks.map(function (pick) {
								var event = _lodash2.default.find(events, function (event) {
									return event._id.toString() === pick.Event;
								});
								return {
									ID: pick.ID,
									Event: event,
									marked: {
										oddLine: event.actionOdd[pick.marked.oddLineTarget] || null,
										oddPoint: event.actionOdd[pick.marked.oddPointTarget] || null,
										oddTarget: pick.marked.oddTarget,
										oddType: pick.marked.oddType,
										oddLineTarget: pick.marked.oddLineTarget,
										oddPointTarget: pick.marked.oddPointTarget
									}
								};
							}));

						case 7:
						case 'end':
							return _context3.stop();
					}
				}
			}, _callee3, _this3);
		}))();
	}
};

var Mutation = exports.Mutation = {
	createBetOrder: function createBetOrder(root, _ref3, ctx) {
		var _this4 = this;

		var action = _ref3.action,
		    passcode = _ref3.passcode,
		    betType = _ref3.betType,
		    betAmount = _ref3.betAmount,
		    atRisk = _ref3.atRisk,
		    toWin = _ref3.toWin,
		    picks = _ref3.picks;
		return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
			var player, _generateAtRiskToWin, recalAtRisk, recalToWin, _ref4, available, pickIDs, existedOpenBets, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, existedOpenBet, uniqEventIDs, mongooseEventIDs, latestEvents, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, pick, latestEvent, sport, league, period, cutOffAt, _latestEvent$team, away, home, eventDetail, latestOddPoint, latestOddLine, pickOddPoint, pickOddLine, oddUpdatedDetail, newBetOrder, savedBetOrder, newPicks, savedPickIDs, theBetOrder;

			return regeneratorRuntime.wrap(function _callee4$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							_context4.prev = 0;
							_context4.next = 3;
							return _User4.default.findOne({ _id: _mongoose2.default.Types.ObjectId(ctx.user._id), passcode: passcode });

						case 3:
							player = _context4.sent;

							if (player) {
								_context4.next = 6;
								break;
							}

							return _context4.abrupt('return', { title: 'Passcode Not Match', content: 'Please try again.', status: 'warning' });

						case 6:
							if (!(player.isUnderAgent && !player.isActivate)) {
								_context4.next = 8;
								break;
							}

							return _context4.abrupt('return', { title: 'Account Has Deactivated', content: 'Please contact Agent.', status: 'warning' });

						case 8:
							_generateAtRiskToWin = (0, _generateAtRiskToWin3.default)(action, betType, betAmount, picks), recalAtRisk = _generateAtRiskToWin.atRisk, recalToWin = _generateAtRiskToWin.toWin;

							if (!(atRisk !== Number(recalAtRisk) || toWin !== Number(recalToWin))) {
								_context4.next = 11;
								break;
							}

							return _context4.abrupt('return', { title: 'Bet Amount Error', content: 'Please try again.', status: 'warning' });

						case 11:
							_context4.next = 13;
							return (0, _player2.default)(ctx.user._id);

						case 13:
							_ref4 = _context4.sent;
							available = _ref4.available;

							if (!(atRisk > available)) {
								_context4.next = 17;
								break;
							}

							return _context4.abrupt('return', { title: 'You Have Not Enough Credit', content: available, status: 'warning' });

						case 17:
							if (!(picks.length > player.wagerLimit[action + 'Team'])) {
								_context4.next = 19;
								break;
							}

							return _context4.abrupt('return', { title: (0, _renameActionFullName2.default)(action) + ' Teams Over Wager Limit', content: 'Please try again.', status: 'warning' });

						case 19:
							if (!(picks.length < _minActionTeams2.default[action])) {
								_context4.next = 21;
								break;
							}

							return _context4.abrupt('return', { title: (0, _renameActionFullName2.default)(action) + ' Teams Under ' + _minActionTeams2.default[action], content: 'Please try again.', status: 'warning' });

						case 21:
							if (!(toWin > player.wagerLimit.maxWin)) {
								_context4.next = 23;
								break;
							}

							return _context4.abrupt('return', { title: 'Win Amount Over Wager Limit ' + player.wagerLimit.maxWin, content: 'Please try again or contact Agent.', status: 'warning' });

						case 23:
							if (!(atRisk < player.wagerLimit.minRisk)) {
								_context4.next = 25;
								break;
							}

							return _context4.abrupt('return', { title: 'Risk Amount Under ' + player.wagerLimit.minRisk, content: 'Please try again or contact Agent.', status: 'warning' });

						case 25:
							//

							//check duplicate order
							pickIDs = picks.map(function (pick) {
								return pick.ID;
							});
							_context4.next = 28;
							return _BetOrder2.default.find({ Player: _mongoose2.default.Types.ObjectId(ctx.user._id), 'bet.action': action, isClosed: false }, 'ID Picks createdAt').populate({ path: 'Picks', select: 'ID' }).then(function (betOrders) {
								return betOrders.map(function (betOrder) {
									return { ID: betOrder.ID, createdAt: betOrder.createdAt, Picks: betOrder.Picks.map(function (Pick) {
											return Pick.ID;
										}) };
								});
							});

						case 28:
							existedOpenBets = _context4.sent;
							_iteratorNormalCompletion = true;
							_didIteratorError = false;
							_iteratorError = undefined;
							_context4.prev = 32;
							_iterator = existedOpenBets[Symbol.iterator]();

						case 34:
							if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
								_context4.next = 41;
								break;
							}

							existedOpenBet = _step.value;

							if (!_lodash2.default.isEqual(pickIDs, existedOpenBet.Picks)) {
								_context4.next = 38;
								break;
							}

							return _context4.abrupt('return', {
								title: 'Order Duplicated',
								content: '#' + existedOpenBet.ID.toUpperCase() + ' Submitted On:, ' + (0, _moment2.default)(existedOpenBet.createdAt).format('ddd MMM DD - hh:mm A'),
								status: 'warning'
							});

						case 38:
							_iteratorNormalCompletion = true;
							_context4.next = 34;
							break;

						case 41:
							_context4.next = 47;
							break;

						case 43:
							_context4.prev = 43;
							_context4.t0 = _context4['catch'](32);
							_didIteratorError = true;
							_iteratorError = _context4.t0;

						case 47:
							_context4.prev = 47;
							_context4.prev = 48;

							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}

						case 50:
							_context4.prev = 50;

							if (!_didIteratorError) {
								_context4.next = 53;
								break;
							}

							throw _iteratorError;

						case 53:
							return _context4.finish(50);

						case 54:
							return _context4.finish(47);

						case 55:
							//

							// check latest odd
							//			await updateEvents();

							uniqEventIDs = _lodash2.default.uniqBy(picks.map(function (pick) {
								return pick.Event;
							}));
							mongooseEventIDs = uniqEventIDs.map(function (eventID) {
								return { _id: _mongoose2.default.Types.ObjectId(eventID) };
							});
							_context4.next = 59;
							return _Event2.default.find({ $or: mongooseEventIDs }).then(function (events) {
								return events.map(function (event) {
									event.action = action;return event;
								});
							});

						case 59:
							latestEvents = _context4.sent;
							_iteratorNormalCompletion2 = true;
							_didIteratorError2 = false;
							_iteratorError2 = undefined;
							_context4.prev = 63;
							_iterator2 = picks[Symbol.iterator]();

						case 65:
							if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
								_context4.next = 86;
								break;
							}

							pick = _step2.value;
							latestEvent = _lodash2.default.find(latestEvents, { _id: _mongoose2.default.Types.ObjectId(pick.Event) });

							if (latestEvent) {
								_context4.next = 70;
								break;
							}

							return _context4.abrupt('return', { title: 'Event Error', content: 'Please pick other event.', status: 'warning' });

						case 70:
							sport = latestEvent.sport, league = latestEvent.league, period = latestEvent.period, cutOffAt = latestEvent.cutOffAt, _latestEvent$team = latestEvent.team, away = _latestEvent$team.away, home = _latestEvent$team.home;
							eventDetail = sport + ' ' + league + ' ' + period + ',' + away + ' vs ' + home;

							if (!latestEvent.isOddExpired) {
								_context4.next = 74;
								break;
							}

							return _context4.abrupt('return', { title: 'Odd Expired ' + (0, _moment2.default)(cutOffAt).format('hh:mm A'), content: eventDetail, status: 'warning' });

						case 74:
							if (latestEvent.isActionOddActivate) {
								_context4.next = 76;
								break;
							}

							return _context4.abrupt('return', { title: 'Event Not Available', content: eventDetail, status: 'warning' });

						case 76:
							latestOddPoint = latestEvent.actionOdd[pick.marked.oddPointTarget] || null;
							latestOddLine = latestEvent.actionOdd[pick.marked.oddLineTarget] || null;
							pickOddPoint = pick.marked.oddPoint || null;
							pickOddLine = pick.marked.oddLine || null;
							oddUpdatedDetail = pick.marked.oddType + ' ' + pick.marked.oddTarget + ' ' + (pickOddPoint ? '( ' + pickOddPoint + ' ) ' : '') + pickOddLine + ' to ' + (latestOddPoint ? '( ' + latestOddPoint + ' ) ' : '') + latestOddLine;

							if (!(latestOddPoint !== pickOddPoint || latestOddLine !== pickOddLine)) {
								_context4.next = 83;
								break;
							}

							return _context4.abrupt('return', { title: 'Odd Has Update', content: eventDetail + ', ' + oddUpdatedDetail, status: 'warning' });

						case 83:
							_iteratorNormalCompletion2 = true;
							_context4.next = 65;
							break;

						case 86:
							_context4.next = 92;
							break;

						case 88:
							_context4.prev = 88;
							_context4.t1 = _context4['catch'](63);
							_didIteratorError2 = true;
							_iteratorError2 = _context4.t1;

						case 92:
							_context4.prev = 92;
							_context4.prev = 93;

							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}

						case 95:
							_context4.prev = 95;

							if (!_didIteratorError2) {
								_context4.next = 98;
								break;
							}

							throw _iteratorError2;

						case 98:
							return _context4.finish(95);

						case 99:
							return _context4.finish(92);

						case 100:
							_context4.next = 102;
							return _Event2.default.update({ $or: mongooseEventIDs }, { $set: { isPicked: true } }, { multi: true });

						case 102:
							newBetOrder = new _BetOrder2.default({
								ID: _uniqid2.default.process(),
								Player: ctx.user._id,
								Agent: player.Agent || null,
								bet: {
									action: action,
									type: betType,
									amount: betAmount,
									toWin: toWin,
									atRisk: atRisk
								},
								resultAmount: null,
								isClosed: false,
								status: 'Pending',
								note: {},
								updatedAt: (0, _moment2.default)(),
								createdAt: (0, _moment2.default)()
							});
							_context4.next = 105;
							return newBetOrder.save();

						case 105:
							savedBetOrder = _context4.sent;
							newPicks = picks.map(function (pick) {
								return new _Pick2.default({
									ID: pick.ID,
									Player: ctx.user._id,
									Agent: player.Agent || null,
									BetOrder: savedBetOrder._id,
									Event: pick.Event,
									marked: pick.marked,
									isClosed: false,
									status: 'Pending',
									note: {},
									updatedAt: (0, _moment2.default)(),
									created: (0, _moment2.default)()
								});
							});
							_context4.next = 109;
							return _Pick2.default.insertMany(newPicks).then(function (picks) {
								return picks.map(function (pick) {
									return pick._id;
								});
							});

						case 109:
							savedPickIDs = _context4.sent;
							_context4.next = 112;
							return _BetOrder2.default.findOneAndUpdate({ _id: _mongoose2.default.Types.ObjectId(savedBetOrder._id) }, { $set: { Picks: savedPickIDs } }, { new: true });

						case 112:
							theBetOrder = _context4.sent;
							return _context4.abrupt('return', { title: 'SUCCESS', content: '#' + savedBetOrder.ID.toUpperCase() + ' CREATED', status: 'success' });

						case 116:
							_context4.prev = 116;
							_context4.t2 = _context4['catch'](0);

							console.log(_context4.t2);
							_context4.next = 121;
							return _SystemLog2.default.create({ title: 'New Open Bet Order Failed', content: ctx.user.username + ' created a open bet Failed ' + _context4.t2, status: 'danger' });

						case 121:
							return _context4.abrupt('return', { title: 'Unknow Error', content: 'Please try again later!', status: 'danger' });

						case 122:
						case 'end':
							return _context4.stop();
					}
				}
			}, _callee4, _this4, [[0, 116], [32, 43, 47, 55], [48,, 50, 54], [63, 88, 92, 100], [93,, 95, 99]]);
		}))();
	}
};
//# sourceMappingURL=index.js.map