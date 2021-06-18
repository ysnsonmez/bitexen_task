// orderbookmodel.js
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var orderBookSchema = new Schema({
    
    ticker: {
        market: {
          market_code: String,
          base_currency_code: String,
          counter_currency_code: String
        },
        bid: Number,
        ask: Number,
        last_price: Number,
        last_size: Number,
        volume_24h: Number,
        change_24h: Number,
        low_24h: Number,
        high_24h: Number,
        avg_24h: Number,
        timestamp: Number
    }

});



module.exports = mongoose.model("OrderBook", orderBookSchema, "OrderBook");