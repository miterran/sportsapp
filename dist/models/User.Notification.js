'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var NotificationSchema = new Schema({
	_id: false,
	deviceToken: { type: String, default: '' },
	afterWager: { type: Boolean, default: false },
	afterPick: { type: Boolean, default: false },
	afterBetOrder: { type: Boolean, default: false }
});

exports.default = NotificationSchema;
//# sourceMappingURL=User.Notification.js.map