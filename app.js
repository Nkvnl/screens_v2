var express = require('express');
var path = require('path');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var Devices = require('./models/device');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
let updated = null 
var brands = [];
var phones = [];
var data = [];
var last = {};
var chunk = [];
var sizeChunk = [];
var picture = null


function getBrands(){
  request('https://www.gsmarena.com/makers.php3', function (error, response, body) {
    var $ = cheerio.load(body)
    $('table a').each(function(index, elem) {
      var brand = $(this).attr('href');
      brands.push({"brand": brand});
    });
    console.log(brands)
  });
    setTimeout(getPhones, 500)
}


function getPhones(){
    brands.forEach(function(list){
    request('https://www.gsmarena.com/' + list.brand, function (error, response, body) {
    var $ = cheerio.load(body)
      $('.makers a').each(function(index, elem) {
        var phone = $(this).attr('href');
        phones.push({"phone": phone});
      });
    });
  });
      console.log(phones)
  setTimeout(getData, 1000)
}


function getData(){
phones.forEach(function(phoneList, index){
setTimeout(() => {
request('https://www.gsmarena.com/' + phoneList.phone, function (error, response, body) {
  if(!error){
    var $ = cheerio.load(body)
    var title = $('.specs-phone-name-title').html().replace(/["']/g, "");
    var a = title.split(" ",1);
    var brand = a[0].replace(/["']/g, "");
    var release = $('span[data-spec="released-hl"]').html().replace(/[^0-9.]/g, "");
    var reso = $('div[data-spec="displayres-hl"]').html().replace(/["']/g, "");
    $('.specs-photo-main img').each(function(index, element) {
      picture = ($(element).attr('src'));
    });
    var getNumber = $('.help-popularity .accent').html();
    var popularity =  JSON.stringify(getNumber).replace(/[^0-9.]/g, "")
    console.log(popularity)
    if(popularity === 0 || popularity === null || popularity === ''){
      return console.log('Low popularity')
    } else {
    var newPhoneData = new Devices({
      title:JSON.stringify(title),
      brand:brand,
      img:picture,
      date:JSON.stringify(release),
      viewport:JSON.stringify(reso),
      popularity:popularity
    });
    console.log(newPhoneData)
    }
    newPhoneData.save(function (err, res) {
      if(err){
        console.log(err)
      } else {
        // console.log(res)
      }
    })
  } else {
    return console.log(error)
  }
});
},index * 200)
});
}

// getBrands()



mongoose.connect('mongodb://niek:device1@ds159624.mlab.com:59624/devices');
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res, next){
  Devices.find({}).sort({popularity: 1}).exec(function(err, allDevices){
  Devices.count(function(err, count){
    for(var x = 0 ; x < count / 18 ; x++){
    chunk.push(allDevices.splice(-18))
    }
    console.log(chunk.length)
    res.render('index',{allDevices:chunk[0]})
  })
  })
})

app.get('/load/:id', function(req,res,next){
  res.json(chunk[req.params.id])
})

app.get('/sizes', function(req, res, next){
  Devices.aggregate(
     {
       $group:{_id: "$viewport", count:{$sum:1}, device:{ $first : {id:"$_id"}}, thumb:{ $first : {img:"$img"}}, popularity:{$avg:"$popularity"},
         },
     },
    { $sort: {popularity: -1}},
    function(err,size){
      if(err){
        console.log(err)
      } else {
    res.render('index',{size:size});
  };
});
});

app.get('/sizes/:id/:timesLoaded', function(req, res, next){
  let y = req.params.timesLoaded;
  sizeChunk = [];
    Devices.find({viewport:req.params.id}).sort({popularity: -1}).exec(function(err, result){
    // Devices.find({viewport:req.params.id},function(err, result){
      let z = result.length / 18
          if(err){
            console.log(err)
            } else {
              for(var x = 0 ; x < z ; x++){
              sizeChunk.push(result.splice(-18))
            }
            if(y <= z){
              res.json(sizeChunk[y]);
              console.log(sizeChunk[y])
            } else {
              res.json('End of list')
            }
      }
  })
})

app.get('/devices', function(req, res, next){
  Devices.aggregate(
     {
       $group:{_id: "$device", count:{$sum:1}, device:{ $first : {id:"$_id"}}, popularity:{$avg:"$popularity"},
        devices: { $push:  { id: "$_id", type: "$type", device: "$device", brand: "$brand", img: "$img", logo: "$logo", viewport: "$viewport", popularity: "$popularity" ,sort: {popularity: -1}}},
         },
     },
    { $sort: {count: -1}},
    function(err, count){
      if(err){
        console.log(err)
      } else {
    for(var x = 0 ; x < count.length / 18 ; x++){
    chunk.push(count.splice(-18))
    // console.log(x)
    }
    console.log(chunk.length)
    console.log(count.length)
    res.render('index',{count:chunk[0]});
    }
  });
});

app.get('/brands', function(req, res, next){
  Devices.aggregate(
     {
       $group:{_id: "$brand", count:{$sum:1}, device:{ $first : {id:"$_id"}}, thumb:{ $first : {img:"$img"}}, popularity:{$avg:"$popularity"},
         },
     },
    { $sort: {popularity: -1}},
    function(err,brand){
      if(err){
        console.log(err)
      } else {
    res.render('index',{brand:brand});
  };
});
});


app.get('/brands/:id/:timesLoaded', function(req, res, next){
  let y = req.params.timesLoaded;
  sizeChunk = [];
    Devices.find({brand:req.params.id}).sort({popularity: -1}).exec(function(err, result){
      let z = result.length / 18
          if(err){
            console.log(err)
            } else {
              for(var x = 0 ; x < z ; x++){
              sizeChunk.push(result.splice(-18))
            }
            if(y <= z){
              res.json(sizeChunk[y]);
              console.log(sizeChunk[y])
            } else {
              res.json('End of list')
            }
      }
  })
})


app.get('/refresh', function(req,res){
  Devices.count(function(err, refresh) {
    res.render('refresh',{refresh:refresh})
  });
})

app.get('/device/:id', function(req, res, next){
  Devices.findById(req.params.id, function(err, device){
    console.log(device);
    console.log(res.json({device:device}))
  })
})


app.listen(process.env.PORT, process.env.IP, function() { // tell node to listen & define a port to view app
    console.log("eCommerce web server starting...");
});


