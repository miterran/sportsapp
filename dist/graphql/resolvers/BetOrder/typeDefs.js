"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Query = exports.Query = "\n\treviewBetOrders: [BetOrderType]\n\t\n\tbetOrders (\n\t\tPlayer: String\n\t\tisClosed: Boolean\n\t\tstartOfWeekNum: Int\n\t\tendOfWeekNum: Int\n\t): [BetOrderType]\n\n\tbetOrdersOverview (\n\t\tPlayer: String\n\t\tisClosed: Boolean\n\t\tstartOfWeekNum: Int\n\t\tendOfWeekNum: Int\n\t):  BetOrdersOverviewType\n\n\tbetOrder (\n\t\tBetOrder: String\n\t): BetOrderType\n\n";

var type = exports.type = "\n\n\ttype BetOrdersOverviewType {\n\t\tactivePlayers: Int\n\t\tresultAmount: Int\n\t\ttotalAtRisk: Int\n\t\ttotalToWin: Int\n\t\ttotalBets: Int\n\t\toverview: OverviewType\n\t}\n\n\ttype OverviewType {\n\t\taction: ActionOverviewType\n\t\tsport: SportOverViewType\n\t\todd: OddOverviewType\n\t}\n\n\ttype ActionOverviewType {\n\t\tstraight: OverviewRecordType\n\t\tparlay: OverviewRecordType\n\t\tbasicTeaser: OverviewRecordType\n\t\tspecialTeaser: OverviewRecordType\n\t\tbigTeaser: OverviewRecordType\n\t\tsuperTeaser: OverviewRecordType\n\t\tactionReverse: OverviewRecordType\n\t\twinReverse: OverviewRecordType\n\t}\n\n\ttype SportOverViewType {\n\t\tBasketball: OverviewRecordType\n\t\tFootball: OverviewRecordType\n\t\tBaseball: OverviewRecordType\n\t\tHockey: OverviewRecordType\n\t\tSoccer: OverviewRecordType\n\t\tFighting: OverviewRecordType\n\t\tESports: OverviewRecordType\n\t}\n\n\ttype OddOverviewType {\n\t\tMLine: OverviewRecordType\n\t\tSpread: OverviewRecordType\n\t\tTotal: OverviewRecordType\n\t\tDraw: OverviewRecordType\n\t}\n\n\ttype OverviewRecordType {\n\t\tWon: Int\n\t\tLost: Int\n\t\tPush: Int\n\t\tPending: Int\n\t}\n\n";
//# sourceMappingURL=typeDefs.js.map