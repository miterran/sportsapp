import { Seeder } from 'mongoose-data-seed';
import Provider from '../src/models/Provider';

const data = [{
	name: 'pm',
    'options' : [ 
        'basketball-nba', 
        'basketball-ncaa', 
        'basketball-wnba', 
        'football-nfl', 
        'football-ncaa', 
        'football-canadian'
    ],
	api: '/',
	isActivate: true,
},{
	name: 'jo',
    'options' : [ 
        {
            "activate" : true,
            "league" : "MLB",
            "sport" : "Baseball",
            "idx" : 0
        }, 
        {
            "activate" : true,
            "league" : "NBA",
            "sport" : "Basketball",
            "idx" : 1
        }, 
        {
            "activate" : true,
            "league" : "NCAAB",
            "sport" : "Basketball",
            "idx" : 2
        }, 
        {
            "activate" : true,
            "league" : "NCAAF",
            "sport" : "Football",
            "idx" : 3
        }, 
        {
            "activate" : true,
            "league" : "NFL",
            "sport" : "Football",
            "idx" : 4
        }, 
        {
            "activate" : true,
            "league" : "NHL",
            "sport" : "Hockey",
            "idx" : 5
        }, 
        {
            "activate" : false,
            "league" : "",
            "sport" : "",
            "idx" : 6
        }, 
        {
            "activate" : true,
            "league" : "",
            "sport" : "Soccer",
            "idx" : 7
        }, 
        {
            "activate" : true,
            "league" : "WNBA",
            "sport" : "Basketball",
            "idx" : 8
        }, 
        {
            "activate" : false,
            "league" : "",
            "sport" : "Tennis",
            "idx" : 9
        }, 
        {
            "activate" : true,
            "league" : "Boxing",
            "sport" : "Fighting",
            "idx" : 10
        }, 
        {
            "activate" : true,
            "league" : "MMA",
            "sport" : "Fighting",
            "idx" : 11
        }, 
        {
            "activate" : false,
            "league" : "",
            "sport" : "Cricket",
            "idx" : 12
        }, 
        {
            "activate" : false,
            "league" : "",
            "sport" : "Horse-Racing",
            "idx" : 13
        }, 
        {
            "activate" : true,
            "league" : "KHL",
            "sport" : "Hockey",
            "idx" : 14
        }, 
        {
            "activate" : true,
            "league" : "AHL",
            "sport" : "Hockey",
            "idx" : 15
        }, 
        {
            "activate" : true,
            "league" : "SHL",
            "sport" : "Hockey",
            "idx" : 16
        }, 
        {
            "activate" : true,
            "league" : "HALL",
            "sport" : "Hockey",
            "idx" : 17
        }, 
        {
            "activate" : true,
            "league" : "LMP",
            "sport" : "Baseball",
            "idx" : 18
        }, 
        {
            "activate" : true,
            "league" : "NPB",
            "sport" : "Baseball",
            "idx" : 19
        }, 
        {
            "activate" : true,
            "league" : "KBO",
            "sport" : "Baseball",
            "idx" : 20
        }, 
        {
            "activate" : false,
            "league" : "",
            "sport" : "Golf",
            "idx" : 21
        }, 
        {
            "activate" : false,
            "league" : "Rugby",
            "sport" : "Football",
            "idx" : 22
        }, 
        {
            "activate" : true,
            "league" : "WBC",
            "sport" : "Baseball",
            "idx" : 23
        }, 
        {
            "activate" : true,
            "league" : "CFL",
            "sport" : "Football",
            "idx" : 24
        }
    ],
	api: '/',
	isActivate: true,
}];

class ProvidersSeeder extends Seeder {

  async shouldRun() {
    return Provider.count().exec().then(count => count === 0);
  }

  async run() {
    return Provider.create(data);
  }
}

export default ProvidersSeeder;
