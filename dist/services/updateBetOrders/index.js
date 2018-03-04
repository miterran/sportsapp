'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _BetOrder = require('../../models/BetOrder');

var _BetOrder2 = _interopRequireDefault(_BetOrder);

var _User = require('../../models/User.Player');

var _User2 = _interopRequireDefault(_User);

var _User3 = require('../../models/User.Agent');

var _User4 = _interopRequireDefault(_User3);

var _SystemLog = require('../../models/SystemLog');

var _SystemLog2 = _interopRequireDefault(_SystemLog);

var _settleBetOrder = require('../../utils/functions/settleBetOrder');

var _settleBetOrder2 = _interopRequireDefault(_settleBetOrder);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import apnProvider from '../../apn'
// import apn from 'apn'

var updateBetOrderResult = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
		var betOrders, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, betOrder, allPicksPending, update, updatedBetOrder;

		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						// eslint-disable-next-line
						console.log('update bet order result');
						_context.prev = 1;
						_context.next = 4;
						return _BetOrder2.default.find({ isClosed: false, status: 'Pending' }, 'Player Agent bet Picks').populate({ path: 'Picks', select: 'status marked.oddLine' });

					case 4:
						betOrders = _context.sent;

						if (!_lodash2.default.isEmpty(betOrders)) {
							_context.next = 7;
							break;
						}

						return _context.abrupt('return');

					case 7:
						_iteratorNormalCompletion = true;
						_didIteratorError = false;
						_iteratorError = undefined;
						_context.prev = 10;
						_iterator = betOrders[Symbol.iterator]();

					case 12:
						if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
							_context.next = 31;
							break;
						}

						betOrder = _step.value;
						allPicksPending = _lodash2.default.every(betOrder.Picks, { status: 'Pending' });

						if (!allPicksPending) {
							_context.next = 17;
							break;
						}

						return _context.abrupt('continue', 28);

					case 17:
						update = (0, _settleBetOrder2.default)(betOrder);

						if (!(update.status === 'Pending')) {
							_context.next = 20;
							break;
						}

						return _context.abrupt('continue', 28);

					case 20:
						_context.next = 22;
						return _BetOrder2.default.findOneAndUpdate({ _id: betOrder._id }, { $set: _lodash2.default.merge(update, { updatedAt: (0, _moment2.default)() }) }, { new: true }).populate('Agent').populate('Player');

					case 22:
						updatedBetOrder = _context.sent;

						if (!(updatedBetOrder.status === 'Review')) {
							_context.next = 26;
							break;
						}

						_context.next = 26;
						return _SystemLog2.default.create({ title: 'BetOrder has Review', content: '' + updatedBetOrder._id, status: 'danger' });

					case 26:
						if (updatedBetOrder.isClosed) {
							_context.next = 28;
							break;
						}

						return _context.abrupt('continue', 28);

					case 28:
						_iteratorNormalCompletion = true;
						_context.next = 12;
						break;

					case 31:
						_context.next = 37;
						break;

					case 33:
						_context.prev = 33;
						_context.t0 = _context['catch'](10);
						_didIteratorError = true;
						_iteratorError = _context.t0;

					case 37:
						_context.prev = 37;
						_context.prev = 38;

						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}

					case 40:
						_context.prev = 40;

						if (!_didIteratorError) {
							_context.next = 43;
							break;
						}

						throw _iteratorError;

					case 43:
						return _context.finish(40);

					case 44:
						return _context.finish(37);

					case 45:
						_context.next = 51;
						break;

					case 47:
						_context.prev = 47;
						_context.t1 = _context['catch'](1);
						_context.next = 51;
						return _SystemLog2.default.create({ title: 'update bet order result failed', content: '' + _context.t1, status: 'danger' });

					case 51:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined, [[1, 47], [10, 33, 37, 45], [38,, 40, 44]]);
	}));

	return function updateBetOrderResult() {
		return _ref.apply(this, arguments);
	};
}();

exports.default = updateBetOrderResult;
//# sourceMappingURL=index.js.map