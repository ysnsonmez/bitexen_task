
const OrderBook = require('../models/orderbookmodel');
const assert = require('assert');
  
describe('Reading a OrderBook', () => {
  let orderbook;
	beforeEach((done) => {
		// orderbook is an instance of orderbook Model
		orderbook = new OrderBook({
            "ticker":{
              "market":{
                "market_code":'BTCTRY',"base_currency_code":"BTC","counter_currency_code":"TRY"
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

    it('Finds OrderBook with market_code', (done) => {
        OrderBook.findOne({"ticker.market.market_code": 'BTCTRY'})
            .then((orderbookvalue) => {
                assert(orderbookvalue.ticker.market.market_code === 'BTCTRY');
                done();
            });
    })

});