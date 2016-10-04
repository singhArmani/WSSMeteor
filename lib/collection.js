
Settings = new Mongo.Collection("settings");
CurrentFlowRate = new Mongo.Collection("todayFlowRate");//per second
MonthFlowRate = new Mongo.Collection("monthFlowRate");//per minute
YearFlowRate = new Mongo.Collection("yearFlowRate");//per hour
Info = new Mongo.Collection("shareInfo");

//State Information Collection
State = new Mongo.Collection('state');

//Collection for LeakRule
LeakRuleCollection = new Mongo.Collection('leakRules');

//Collection for WaterUsage state
WaterUsageState = new Mongo.Collection('waterUsageState');


//Leak Detected History
LeakDetectedHistory = new Mongo.Collection('leakDetectedHistory');