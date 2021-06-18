// orderbookdailystatisticsmodel.js
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var orderBookDailyStatisticsSchema = new Schema({
    RecordDate: Number,
    MinimumPrice : Number,
    MaximumPrice : Number,
    AveragePrice : Number,
    TotalVolume : Number
});



module.exports = mongoose.model("OrderBookDailyStatistics", orderBookDailyStatisticsSchema, "OrderBookDailyStatistics");