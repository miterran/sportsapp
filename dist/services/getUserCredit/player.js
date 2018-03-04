'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _User = require('../../models/User.Player');

var _User2 = _interopRequireDefault(_User);

var _BetOrder = require('../../models/BetOrder');

var _BetOrder2 = _interopRequireDefault(_BetOrder);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var getPlayerCurrentCredit = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(PlayerID) {
		var initialCredit, balance, pending;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						_context.next = 3;
						return _User2.default.findOne({ _id: _mongoose2.default.Types.ObjectId(PlayerID) }, 'wagerLimit.initialCredit').then(function (data) {
							return data.wagerLimit.initialCredit;
						});

					case 3:
						initialCredit = _context.sent;
						_context.next = 6;
						return _BetOrder2.default.find({ Player: _mongoose2.default.Types.ObjectId(PlayerID), isClosed: true, updatedAt: { $gte: (0, _moment2.default)().startOf('isoWeek'), $lte: (0, _moment2.default)().endOf('isoWeek') } }, 'resultAmount').then(function (orders) {
							return orders.map(function (order) {
								return order.resultAmount;
							});
						}).reduce(function (sum, amount) {
							return sum + amount;
						}, 0);

					case 6:
						balance = _context.sent;
						_context.next = 9;
						return _BetOrder2.default.find({ Player: _mongoose2.default.Types.ObjectId(PlayerID), isClosed: false, createdAt: { $gte: (0, _moment2.default)().startOf('isoWeek'), $lte: (0, _moment2.default)().endOf('isoWeek') } }, 'bet.atRisk').then(function (orders) {
							return orders.map(function (order) {
								return order.bet.atRisk;
							});
						}).reduce(function (sum, amount) {
							return sum + amount;
						}, 0);

					case 9:
						pending = _context.sent;
						return _context.abrupt('return', {
							initial: initialCredit,
							balance: balance,
							pending: pending,
							available: initialCredit + balance - pending
						});

					case 13:
						_context.prev = 13;
						_context.t0 = _context['catch'](0);
						throw new Error(_context.t0);

					case 16:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined, [[0, 13]]);
	}));

	return function getPlayerCurrentCredit(_x) {
		return _ref.apply(this, arguments);
	};
}();

exports.default = getPlayerCurrentCredit;
//# sourceMappingURL=player.js.map