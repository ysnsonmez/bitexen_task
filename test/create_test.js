
//import the OrderBook model
const OrderBook = require('../models/orderbookmodel');
const assert = require('assert');
  
describe('Creating documents in MongoDB', () => {
    it('Creates a Order Book', (done) => {
        const newOrderBook = new OrderBook({
          "ticker":{
            "market":{
              "market_code":"BTCTRY","base_currency_code":"BTC","counter_currency_code":"TRY"
            },
            "bid":333510.56,
            "ask":334010.41,
            "last_price":333798.4,
            "last_size":0.00053598,
            "volume_24h":533.91,
            "change_24h":-2.75,
            "low_24h":328575.56,
            "high_24h":347481.75,
            "avg_24h":336154.99,
            "timestamp":1623888944.211674}
        });
        newOrderBook.save() // returns a promise after some time
            .then(() => {
                //if the newUser is saved in db and it is not new
                assert(!newOrderBook.isNew);
                done();
            });
    });
});

