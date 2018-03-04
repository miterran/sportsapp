'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Sign = require('./resolvers/Sign');

var Sign = _interopRequireWildcard(_Sign);

var _User = require('./resolvers/User');

var User = _interopRequireWildcard(_User);

var _Action = require('./resolvers/Action');

var Action = _interopRequireWildcard(_Action);

var _BetOrder = require('./resolvers/BetOrder');

var BetOrder = _interopRequireWildcard(_BetOrder);

var _Setting = require('./resolvers/Setting');

var Setting = _interopRequireWildcard(_Setting);

var _Event = require('./resolvers/Event');

var Event = _interopRequireWildcard(_Event);

var _LogoCollect = require('./resolvers/LogoCollect');

var LogoCollect = _interopRequireWildcard(_LogoCollect);

var _SystemLog = require('./resolvers/SystemLog');

var SystemLog = _interopRequireWildcard(_SystemLog);

var _Pick = require('./resolvers/Pick');

var Pick = _interopRequireWildcard(_Pick);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootResolvers = {
	RootQuery: _lodash2.default.merge(Sign.Query, User.Query, Action.Query, BetOrder.Query, Event.Query, LogoCollect.Query, SystemLog.Query, Pick.Query),
	RootMutation: _lodash2.default.merge(Sign.Mutation, Action.Mutation, Setting.Mutation, User.Mutation, Event.Mutation)
	// 	RootSubscription: _.merge(
	// //		Notification.Subscription
	// 	)
};
//import * as Notification from './resolvers/Notification';
exports.default = rootResolvers;
//# sourceMappingURL=rootResolvers.js.map