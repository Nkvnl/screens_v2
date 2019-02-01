var express = require('express');
var path = require('path');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var Devices = require('./models/device');
var request = require('request');
// var cheerio = require('cheerio');
var app = express();
let updated = null 
var brands = [];
var phones = [];
var data = [];
var last = {};
var chunk = [];
var sizeChunk = [];
var picture = null


// function getBrands(){
//   request('https://www.gsmarena.com/makers.php3', function (error, response, body) {
//     var $ = cheerio.load(body)
//     $('table a').each(function(index, elem) {
//       var brand = $(this).attr('href');
//       brands.push({"brand": brand});
//     });
//     console.log(brands)
//   });
//     setTimeout(getPhones, 500)
// }


// function getPhones(){
//     brands.forEach(function(list){
//       // console.log(list)
//     request('https://www.gsmarena.com/' + list.brand, function (error, response, body) {
//     var $ = cheerio.load(body)
//     // console.log('https://www.gsmarena.com/' + brands[1].brand)
//       $('.makers a').each(function(index, elem) {
//         var phone = $(this).attr('href');
//         phones.push({"phone": phone});
//       // console.log(phone)
//       });
//       // var res = $('.makers')
//     });
//   });
//       console.log(phones)
//   setTimeout(getData, 1000)
// }


// function getData(){
// phones.forEach(function(phoneList, index){
// setTimeout(() => {
// request('https://www.gsmarena.com/' + phoneList.phone, function (error, response, body) {
//   if(!error){
//     var $ = cheerio.load(body)
//     var title = $('.specs-phone-name-title').html();
//     var release = $('span[data-spec="released-hl"]').html();
//     var reso = $('div[data-spec="displayres-hl"]').html();
//     $('.specs-photo-main img').each(function(index, element) {
//       picture = ($(element).attr('src'));
//     });
//     var getNumber = $('.help-popularity .accent').html();
//     var popularity =  JSON.stringify(getNumber).replace(/[^0-9.]/g, "")
//     var newPhoneData = new Devices({
//       title:JSON.stringify(title),
//       img:picture,
//       date:JSON.stringify(release),
//       viewport:JSON.stringify(reso),
//       popularity:popularity
//     });
//     newPhoneData.save(function (err, res) {
//       if(err){
//         console.log(err)
//       } else {
//       }
//     })
//     // console.log(last)
//     console.log(phones.length + 'p')
//     console.log(data.length)
//   } else {
//     return console.log(error)
//   }
// });
// },index * 200)
// });
// }

// getBrands()



mongoose.connect('mongodb://niek:device1@ds159624.mlab.com:59624/devices');
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res, next){
  Devices.find(function(err, allDevices){
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
        // devices: { $push:  { id: "$_id",type: "$type", device: "$device", brand: "$brand", img: "$img", logo: "$logo", viewport: "$viewport", popularity: "$popularity" ,sort: {popularity: -1}}},
         },
     },
    { $sort: {count: -1}},
    function(err,size){
      if(err){
        console.log(err)
      } else {
    res.render('index',{size:size});
  };
});
});

app.get('/sizes/:id/:timesLoaded', function(req, res, next){
    Devices.find({viewport:req.params.id},function(err, result){
      Devices.count(function(err, count){
          if(err){
            console.log(err)
            } else {
              for(var x = 0 ; x < count / 18 ; x++){
              sizeChunk.push(result.splice(-18))
            }
            console.log(sizeChunk[req.params.timesLoaded])
        res.json(sizeChunk[req.params.timesLoaded]);
      }
    })
  })
})




app.get('/popular', function(req,res){
  Devices.find(function(err, mostPopular) {
    res.render('index',{allDevices:mostPopular})
  });
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
  console.log('brands')
  Devices.aggregate(
     {
       $group:{_id: "$brand", count:{$sum:1}, info: { $first : {logo: "$logo"}}, popularity : {$avg : "$popularity"}, 
        devices: { $push:  { type: "$type", device: "$device", brand: "$brand", img: "$img", logo: "$logo", viewport: "$viewport", popularity: "$popularity" ,sort: {popularity: -1}}},
         },
    },
    { $sort: {count: -1}},
    function(err, brands){
      if(err){
        console.log(err)
      } else {
    console.log(brands)
    res.render('index',{brands:brands});
    }
  });
});

app.get('/device/:id', function(req, res, next){
  Devices.findById(req.params.id, function(err, device){
    console.log(device);
    console.log(res.json({device:device}))
  })
})


app.listen(process.env.PORT, process.env.IP, function() { // tell node to listen & define a port to view app
    console.log("eCommerce web server starting...");
});


