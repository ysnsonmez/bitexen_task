
const OrderBook = require('../models/orderbookmodel');
const assert = require('assert');
  
describe('Deleting a orderbook', () => {
  
    let orderbook;
    beforeEach((done) => {
        orderbook = new OrderBook({
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
        orderbook.save()
            .then(() => done());
    });
  
    // Handling Redundant Code
    function helperFunc(assertion, done) {
    assertion
        .then(() => OrderBook.find({}))
        .then((orderbooks) => {
            assert(orderbooks.length === 1);
            assert(orderbooks[0].ticker.market.market_code === 'BTCUSDT');
            done();
        });
    }
  
    it('Sets and saves a orderbook using an instance', (done) => {
        // Not yet updated in MongoDb
        orderbook.set('ticker.market.market_code', 'BTCUSDT');
        helperFunc(orderbook.save(), done);
    });
  
    it('Update a orderbook using instance', (done) => {
        helperFunc(orderbook.updateOne({ "ticker.market.market_code": 'BTCUSDT' }), done);
    });
});