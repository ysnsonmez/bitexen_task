// server.js
const express = require("express");
const axios = require('axios');
const cron = require('node-cron');
const app = express();
const connectDb = require("./helper/connection");
const PORT = 8080;

const OrderBookModel = require("./models/orderbookmodel")
const OrderBookDailyStatisticsModel = require("./models/orderbookdailystatisticsmodel")

const today = {
    iso: {
      start: () => new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      now: () => new Date().toISOString(),
      end: () => new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
    },
    local: {
    start: () => new Date(new Date(new Date().setHours(0, 0, 0, 0)).toString().split('GMT')[0] + ' UTC').toISOString(),
    now: () => new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString(),
    end: () => new Date(new Date(new Date().setHours(23, 59, 59, 999)).toString().split('GMT')[0] + ' UTC').toISOString()
    }
}

app.get("/getDailyStatistics", (req, res) => {

    console.log("startOfDay: ", new Date(today.iso.start()).getTime())
    console.log("endOfDay: ", new Date(today.iso.end()).getTime())

    var startOfDay = new Date(today.iso.start()).getTime() / 1000;
    var endOfDay =  new Date(today.iso.end()).getTime() / 1000;
    
    var dailyResult = {
        "MinimumPrice" : 0.0,
        "MaximumPrice" : 0.0,
        "AveragePrice" : 0.0,
        "TotalVolume" : 0.0
    }; 

    var query = {
        "ticker.timestamp": {
            "$lte" : endOfDay, "$gte": startOfDay
        }
    };
          
    OrderBookModel.find(query).sort({ "ticker.last_price" : -1 }).then((OrderBookValues) => {

        console.log(OrderBookValues.length)
        dailyResult.MaximumPrice = OrderBookValues[0].ticker.last_price;
        dailyResult.MinimumPrice = OrderBookValues[OrderBookValues.length - 1].ticker.last_price;

        OrderBookValues.forEach(element => {
            dailyResult.AveragePrice += element.ticker.last_price / OrderBookValues.length;
            dailyResult.TotalVolume += element.ticker.volume_24h / OrderBookValues.length;
        });

        res.json(dailyResult);
      }).catch((err) => {
        res.json(err);
    });


});

app.get("/getWeeklyStatistics", (req, res) => {

    var startDayOfWeek = (new Date(today.iso.start()).getTime() - 7.00 * 24.00 * 60.00 * 60.00 * 1000) / 1000;
    var endDayOfWeek =  new Date(today.iso.end()).getTime() / 1000;

    console.log("startDayOfWeek: ", startDayOfWeek)
    console.log("endDayOfWeek: ", endDayOfWeek)
    
    var weeklyResult = {
        "MinimumPrice" : 0.0,
        "MaximumPrice" : 0.0,
        "AveragePrice" : 0.0,
        "TotalVolume" : 0.0
    }; 

    var query = {
        "RecordDate": {
            "$lte" : endDayOfWeek, "$gte": startDayOfWeek
        }
    };
          
    OrderBookDailyStatisticsModel.find(query).sort({ "RecordDate" : -1 }).then((DailyStatisticsValues) => {

        // console.log(DailyStatisticsValues.length)

        weeklyResult.MaximumPrice = Math.max.apply(Math, DailyStatisticsValues.map(function(o) { return o.MaximumPrice; }));
        weeklyResult.MinimumPrice = Math.min.apply(Math, DailyStatisticsValues.map(function(o) { return o.MinimumPrice; }))

        DailyStatisticsValues.forEach(element => {
            weeklyResult.AveragePrice += element.AveragePrice / DailyStatisticsValues.length;
            weeklyResult.TotalVolume += element.TotalVolume / DailyStatisticsValues.length;
        });

        // console.log(weeklyResult);

        res.json(weeklyResult);
      }).catch((err) => {
        res.json(err);
    });
});

app.get("/getMontlyStatistics", (req, res) => {

    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0).getTime()/1000;
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).getTime()/1000;

    // console.log("firstDay: ", firstDay)
    // console.log("lastDay: ", lastDay)
    
    var monthlyResult = {
        "MinimumPrice" : 0.0,
        "MaximumPrice" : 0.0,
        "AveragePrice" : 0.0,
        "TotalVolume" : 0.0
    }; 

    var query = {
        "RecordDate": {
            "$lte" : lastDay, "$gte": firstDay
        }
    };
          
    OrderBookDailyStatisticsModel.find(query).sort({ "RecordDate" : -1 }).then((DailyStatisticsValues) => {

        // console.log(DailyStatisticsValues.length)
        
        monthlyResult.MaximumPrice = Math.max.apply(Math, DailyStatisticsValues.map(function(o) { return o.MaximumPrice; }));
        monthlyResult.MinimumPrice = Math.min.apply(Math, DailyStatisticsValues.map(function(o) { return o.MinimumPrice; }))

        DailyStatisticsValues.forEach(element => {
            monthlyResult.AveragePrice += element.AveragePrice / DailyStatisticsValues.length;
            monthlyResult.TotalVolume += element.TotalVolume / DailyStatisticsValues.length;
        });

        // console.log(monthlyResult);

        res.json(monthlyResult);
      }).catch((err) => {
        res.json(err);
    }); 
});

async function saveDailyStatisticData(arg) {

    // console.log("startOfDay: ", new Date(today.iso.start()).getTime())
    // console.log("endOfDay: ", new Date(today.iso.end()).getTime())

    var startOfDay = new Date(today.iso.start()).getTime() / 1000;
    var endOfDay =  new Date(today.iso.end()).getTime() / 1000;
    
    var dailyResult = {
        "RecordDate" : 0.0,
        "MinimumPrice" : 0.0,
        "MaximumPrice" : 0.0,
        "AveragePrice" : 0.0,
        "TotalVolume" : 0.0
    }; 

    var query = {
        "ticker.timestamp": {
            "$lte" : endOfDay, "$gte": startOfDay
        }
    };
          
    OrderBookModel.find(query).sort({ "ticker.last_price" : -1 }).then((OrderBookValues) => {

        console.log(OrderBookValues.length)
        dailyResult.MaximumPrice = OrderBookValues[0].ticker.last_price;
        dailyResult.MinimumPrice = OrderBookValues[OrderBookValues.length - 1].ticker.last_price;

        OrderBookValues.forEach(element => {
            dailyResult.AveragePrice += element.ticker.last_price / OrderBookValues.length;
            dailyResult.TotalVolume += element.ticker.volume_24h / OrderBookValues.length;
        });
        // console.log(dailyResult)

        dailyResult.RecordDate = new Date(today.iso.start()).getTime() / 1000;

        new OrderBookDailyStatisticsModel(dailyResult).save().then(() => {
            console.log({message: "daily result save success"});
        }).catch((err) => {
            console.log(err);
        });

      }).catch((err) => {
        console.log(err);
    });

}

async function getOrderBookData(arg) {
    
    console.log(`order book => ${arg}`);

    var url = `https://www.bitexen.com/api/v1/order_book/${arg}/`;

    axios.get(url)
      .then(response => {
        // console.log("response order book data: ", response.data.data.ticker);

        new OrderBookModel({ticker: response.data.data.ticker}).save().then(() => {
            console.log({message: "save success"});
        }).catch((err) => {
            console.log(err);
        });
      })
      .catch(error => {
        console.log(error);
      });

}

app.listen(PORT, function() {

    console.log(`Listening on ${PORT}`);
    connectDb().then(() => {
        console.log("MongoDb connected");
    });

    // cron.schedule('0 0 * * 0', function() {
    //     console.log('running a task every week “At 00:00 on Sunday.”');
    // });

    cron.schedule('59 23 * * *', function() {
        console.log('running a task every day “At 01:00.”');
        saveDailyStatisticData();
    });
      

    setInterval(() => {
        getOrderBookData("BTCTRY");
    }, 5000)

});