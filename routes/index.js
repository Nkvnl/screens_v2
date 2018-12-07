var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var mongoose = require('mongoose');
var stripe = require("stripe")("sk_test_DOdZsdHz1smVYLx6q5IUvktO");

var Product = require('../models/product');
var Title = require('../models/title');
var Title1 = require('../models/title1');
var Title2 = require('../models/title2');
var Title3 = require('../models/title3');
var Title4 = require('../models/title4');
var Order = require('../models/order');
var User = require('../models/user');
var Preview = require('../models/productpreview');
var Headerpreview = require('../models/headerpreview')
event = null;
var middleware= require('../middleware/middleware')
const {isAdmin } = middleware;


////////////////////////////////////////////////////
 function createCharge(id, events, type, amount, currency, source, req, res) {
    setTimeout(() => {
       event = (id)
    events = event;
    // console.log(event)
    // console.log('this is the event!')
    if(type === 'charge.succeeded'){
        // console.log(req.body.type)
        return res.sendStatus(200);
    } else {
    if(type === 'source.chargeable'){
        // console.log('it is!');
        // console.log(req.body);
        stripe.charges.create({
            amount: amount,
            currency: currency,
            source: source,
            // object: req.body.data.object.type,
        }).then( function(charge) {
            // var reqbody = req.body;
            // console.log('render');
            // console.log(reqbody)
            return res.sendStatus(200)
            // return res.render('shop/charge',{reqbody : reqbody})
        });
            } else {
                return res.redirect('/checkout');
        }  
    }
},1000)
};  

/////////////////////////////////////////////////////////


function redirect(req, res){
       setTimeout(() => {
        var stripe = require("stripe")("sk_test_DOdZsdHz1smVYLx6q5IUvktO");
        console.log(String(event))
        console.log('this is the var^^^^^^')
        console.log(event)
        console.log('this is the event^^^^^^^')
        User.findById(req.user.id, function(err, foundUser){
    stripe.events.retrieve(
        String(event),
         function(err, events) {
            var currency = events.data.object.currency;
            var amount = events.data.object.amount / 100;
            if (err){
                console.log(err)
            } else {
                console.log(events.type)
                if(events.type === 'source.chargeable' || events.type ==='charge.succeeded'){
                // if(events.type === 'charge.succeeded' || events.type === 'source.chargeable' ){
                    console.log('chargeable or succeeded')
                    return res.render('shop/success', {users : foundUser, amount:amount, currency: currency} )
                }
                if(events.type === 'source.cancelled' || events.type === 'source.failed'){
                    return res.redirect('/checkout')
                }
                else {
                    return res.redirect('/checkout')
                }
    };
});
});
       }, 5000)
}


function exit() {
    mongoose.disconnect();
}

router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Title.find( function(err, foundTitles){
    Title1.find( function(err, foundTitles1){
    Title2.find( function(err, foundTitles2){
    Title3.find( function(err, foundTitles3){
    Title4.find( function(err, foundTitles4){
    Product.find(function(err, docs){
        var productChunks = [];
        var chunkSize = 4;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
            res.render('shop/index', {title: 'Shopping Cart', titles: foundTitles, titles4: foundTitles4, titles3: foundTitles3, titles2: foundTitles2, titles1: foundTitles1, products: productChunks ,successMsg: successMsg, noMessages: !successMsg});
    });    
    });   
    });    
    });    
    });    
    });
});


// /* GET home page. */
// router.get('/', function (req, res, next) {
//     var successMsg = req.flash('success')[0];
//     Product.find(function (err, docs) {
//         var productChunks = [];
//         var chunkSize = 4;
//         for (var i = 0; i < docs.length; i += chunkSize) {
//             productChunks.push(docs.slice(i, i + chunkSize));
//         }
//         res.render('shop/index', {title: 'Shopping Cart', titles:  ,products: productChunks, successMsg: successMsg, noMessages: !successMsg});
//     });
// });



router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
       if (err) {
           return res.redirect('/');
       }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

// router.get('/reduce/:id', function(req, res, next) {
//     var productId = req.params.id;
//     var cart = new Cart(req.session.cart ? req.session.cart : {});

//     cart.reduceByOne(productId);
//     req.session.cart = cart;
//     res.redirect('/shopping-cart');
// });

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart',  function(req, res, next) {
   if (!req.session.cart) {
       return res.render('shop/shopping-cart', {products: null});
   } 
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {products: cart.generateArray(), total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/charge', isLoggedIn, function(req, res, next){
    if (!req.session.cart){
        return res.redirect('/shopping-cart')
    }
    var cart = new Cart(req.session.cart);
    var stripe = require("stripe")(
        "sk_test_DOdZsdHz1smVYLx6q5IUvktO"
    );
    stripe.sources.create({
        type: 'ideal',
        amount: cart.totalPrice * 100,
        currency: 'eur',
        statement_descriptor: 'TEST',
        owner: {
        name: req.body.name,
    },
        redirect: {
            return_url: 'https://webshop-template-niekavanlosenoord.c9users.io/shop/charge/',
        }
        }).then(function(result){
            res.redirect(result.redirect.url)
        })
})

// Webhook
router.post('/webhook', function(req, res) {
    createCharge(req.body.id, req.session.event, req.body.type, req.body.data.object.amount, req.body.data.object.currency, req.body.data.object.id, req, res)
});

// router.post('/webhook', function(req, res){

// console.log(req.body)
// // console.log('charge route!')
// res.sendStatus(200)
    
// });

router.get('/shop/charge/', function(req, res){
    redirect(req, res)
    // res.render('shop/charge')
});

router.get('/shop/charge/success', function(req, res){
    res.render('shop/success')
    // res.render('shop/charge')
});


// router.get('/shop/charge/', function(req, res){
// var stripe = require("stripe")("sk_test_DOdZsdHz1smVYLx6q5IUvktO");
//         console.log(String(event))
//         console.log('this is the var^^^^^^')
//         console.log(event)
//         console.log('this is the event^^^^^^^')
//     stripe.events.retrieve(
//         String(event),
//          function(err, events) {
//             if (err){
//                 console.log(err)
//             } else {
//                 if(events.type === 'source.chargeable'){
//                     console.log('chargeable')
//                 }
//                 if(events.type === 'source.cancelled'){
//                     console.log('cancelled')
//                 }
//                 if(events.type === 'source.failed'){
//                     console.log('failed')
//                 } else {
//                     console.log('end of statement')
//                 }
//                 console.log(events.id)
//                 console.log(events.data.object.amount)
//                 console.log(events.type)
//     };
//     res.render('shop/charge')
// });
// });




      

// router.get('/success', function(req, res) {
//     var stripe = require("stripe")("sk_test_DOdZsdHz1smVYLx6q5IUvktO");
//     var cart = new Cart(req.session.cart);

// var charge = stripe.charges.create({
//   amount: cart.totalPrice * 100,
//   currency: 'eur',
//   source: stripe.sources.id,
// }, function(err, charge) {
//   // asynchronously called
// });
// });






// router.post('/charge',isLoggedIn, function(req,res,next){
//     if (!req.session.cart){
//         return res.redirecht('/shopping-cart')
//     }
//     var cart = new Cart(req.session.cart);
//     var stripe = require("stripe")(
//         "sk_test_DOdZsdHz1smVYLx6q5IUvktO"
//     );
//     console.log(cart)
//     stripe.charges.create({ 
        
//     type: 'ideal',
//     amount: cart.totalPrice * 100,
//     currency: 'eur',
//     statement_descriptor: 'ORDER AT11990',
//     owner: {
//       name: req.body.name,
//     },
//     redirect: {
//       return_url: 'https://webshop-template-niekavanlosenoord.c9users.io/success',
//     },
//     }).then(function(result) {
//   // handle result.error or result.source
//     });
// });

// router.get('/success',isLoggedIn, function(req,res,next){
//     var stripe = require("stripe")("sk_test_DOdZsdHz1smVYLx6q5IUvktO");
//     var cart = new Cart(req.session.cart);

//     stripe.charges.create({
//         amount: cart.totalPrice * 100,
//         currency: "eur",
//         source: "src_18eYalAHEMiOZZp1l9ZTjSU0",
//     }, function(err, charge) {
//   // asynchronously called
// });
// });







// function stripeSourceHandler(source) {
//   // Redirect the customer to the authorization URL.
//   document.location.href = source.redirect.url;
// }

// router.post('/charge', isLoggedIn, function(req, res, next) {
//     if (!req.session.cart) {
//         return res.redirect('/shopping-cart');
//     }
//     var cart = new Cart(req.session.cart);
    
//     var stripe = require("stripe")(
//         "sk_test_DOdZsdHz1smVYLx6q5IUvktO"
//     );
    

//     stripe.charges.create({
//         amount: cart.totalPrice * 100,
//         currency: "eur",
//         source: "src_18eYalAHEMiOZZp1l9ZTjSU0", // obtained with Stripe.js
//         description: "Test Charge"
//     }, function(err, charge) {
//         if (err) {
//             req.flash('error', err.message);
//             return res.redirect('/checkout');
//         }
//         var order = new Order({
//             user: req.user,
//             cart: cart,
//             name: req.body.name,
//             email: req.body.email,
//             street: req.body.street,
//             number: req.body.number,
//             city: req.body.city,
//             zip: req.body.zip,
//             country: req.body.country,
//             paymentId: charge.id
//         });
//         order.save(function(err, result) {
//             req.flash('success', 'Successfully bought product!');
//             req.session.cart = null;
//             res.redirect('/');
//         });
//     }); 
// });

//DASHBOARD ROUTES//

router.get('/dashboard', isAdmin, function(req, res, next){
        var totalItems = Product.length + 1;
        var totalUsers = User.length + 1;
        User.findById(req.user.id, function(err, foundUser){
       res.render('admin/dashboard', {users: foundUser, totalItems : totalItems, totalUsers:totalUsers}) 
    })
})

router.get('/dashboard/add', isAdmin, function(req, res, next){
            User.findById(req.user.id, function(err, foundUser){
       res.render('admin/add', {users: foundUser}) 
    })
});

router.post("/preview", function(req, res) {
    console.log(req.body);
    var title = req.body.title;
    var price = req.body.price;
    var descriptionFull = req.body.descriptionFull;
    var descriptionShort = req.body.descriptionShort;
    var imagePath = req.body.imagePath;
    var imagePath1 = req.body.imagePath1;
    var imagePath2 = req.body.imagePath2;
    var imagePath3 = req.body.imagePath3;
    var imagePath4 = req.body.imagePath4;
    var newPreview = {
        title: title,
        price: price,
        descriptionShort: descriptionShort,
        descriptionFull: descriptionFull,
        imagePath: imagePath,
        imagePath1: imagePath1,
        imagePath2: imagePath2,
        imagePath3: imagePath3,
        imagePath4: imagePath4

    };
    // Create a new campground and save to DB
    Preview.create(newPreview, function(err, preview) {
        if (err) {
            console.log(err);
        }
        else {
            //redirect back to campgrounds page
            res.render("admin/add", {previews:preview});
        }
    });
});

router.post('/add', function(req,res,next){
    Preview.findOne(function(err, products){
        console.log(products)
                if(err){
            console.log(err)
        } else { 
            var title = products.title;
    var price = products.price;
    var descriptionFull = products.descriptionFull;
    var descriptionShort = products.descriptionShort;
    var imagePath = products.imagePath;
    var imagePath1 = products.imagePath1;
    var imagePath2 = products.imagePath2;
    var imagePath3 = products.imagePath3;
    var imagePath4 = products.imagePath4;
    var newProduct = {
        title: title,
        price: price,
        descriptionShort: descriptionShort,
        descriptionFull: descriptionFull,
        imagePath: imagePath,
        imagePath1: imagePath1,
        imagePath2: imagePath2,
        imagePath3: imagePath3,
        imagePath4: imagePath4
    }
    }
    Product.create(newProduct, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated)
            //redirect back to campgrounds page
            res.redirect("/");
        }
    });
    Preview.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });
    })
})

// router.post("/add", function(req,res, next){
//     Preview.find(function(err, products){
//         if(err){
//             console.log(err)
//         } else { 
//         var prods = [  
//             new Product ({
//             title: products.title,
//             price: products.price,
//             descriptionShort: products.descriptionShort,
//             descriptionFull: products.descriptionFull,
//             imagePath: products.imagePath,
//             imagePath1: products.imagePath1,
//             imagePath2: products.imagePath2,
//             imagePath3: products.imagePath3,
//             imagePath4: products.imagePath4 
//             })
//         ]
//         var done = 0;
//             for (var i = 0; i < prods.length; i++) {
//             prods[i].save(function(err, result) {
//             done++;
//                 if (done === prods.length) {
//                 exit();
//         }});
//     }};
// });



//         }}; 
//             Product.create(newProduct, function(err, preview) {
                
//         // var successMsg = req.flash('Artikel toegevoegd!');
//         if (err) {
//             console.log(err)
//         // var errorMsg = req.flash('Er is iets misgegaan');
//         }
//         else {
//             res.render("shop/index");
//         }});
//     });
// });


router.get('/dashboard/editdel', isAdmin, function(req, res, next){
    User.findById(req.user.id, function(err, foundUser){
    Product.find(function(err, foundProduct){
       res.render('admin/editdel', {products: foundProduct, users:foundUser}) 
    })
  })
})

router.get('dashboard/edit/:id', isAdmin, function(req, res, next){
    Product.findById(req.params.id, function(err, foundProduct){
       res.render('admin/edit', {products: foundProduct}) 
    })
})

router.get('/dashboard/assortiment', isAdmin,  function(req, res, next){
    Product.find( function(err, foundProduct){
    User.findById(req.user.id, function(err, foundUser){
       res.render('admin/assortiment', {products: foundProduct, users:foundUser}) 
    });
    });
});

router.get('/dashboard/design-aanpassen', function(req, res, next){
    User.findById(req.user.id, function(err, foundUser){
    Title.find( function(err, foundTitles){
    Title1.find( function(err, foundTitles1){
    Title2.find( function(err, foundTitles2){
    Title3.find( function(err, foundTitles3){
    Title4.find( function(err, foundTitles4){
       res.render('admin/design', {users: foundUser, titles: foundTitles, titles1: foundTitles1, titles2: foundTitles2, titles3: foundTitles3, titles4: foundTitles4}) 
    });
    });
    });
    });
    });
    });
});

router.get('/dashboard/design-aanpassen/header1', function(req, res, next){
    Title.find(function(err, foundTitle){
    User.findById(req.user.id, function(err, foundUser){
       res.render('admin/editheader1', {titles: foundTitle, users:foundUser}) 
    });
    });
})
//HEADER 1
router.post("/editheader1", function(req, res) {
    console.log(req.body);
    var mainImage = req.body.mainImage;
    var mainTitle = req.body.mainTitle;
    var mainParagraph = req.body.mainParagraph;
    var gradient = req.body.gradient;
    var link = req.body.link;
    var newHeaderPreview = {
        mainImage: mainImage,
        mainTitle: mainTitle,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    };
    Headerpreview.create(newHeaderPreview, function(err, headerPreview) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("admin/editheader1", {headerPreviews:headerPreview});
        }
    });
});

// router.post('/header1add', function(req, res, next){
//     Headerpreview.findOne(function(err, headerpreviews){
//         console.log(headerpreviews)
//     })
// })

router.post('/header1add', function(req,res,next){
    Title.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });    
    Headerpreview.findOne(function(err, headerpreviews){
        console.log(headerpreviews)
                if(err){
            console.log(err)
        } else { 
    var mainTitle = headerpreviews.mainTitle;
    var mainImage = headerpreviews.mainImage;
    var mainParagraph = headerpreviews.mainParagraph;
    var gradient = headerpreviews.gradient;
    var link = headerpreviews.link;
    var newHeader = {
        mainTitle: mainTitle,
        mainImage: mainImage,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    }
    }
    Title.create(newHeader, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated)
            //redirect back to campgrounds page
            res.redirect("/");
        }
    });
    Headerpreview.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    //     });
    });
    });
    // });
});
//HEADER 2

router.get('/dashboard/design-aanpassen/header2', function(req, res, next){
    Title.find(function(err, foundTitle){
    User.findById(req.user.id, function(err, foundUser){
       res.render('admin/editheader2', {titles: foundTitle, users:foundUser}) 
    });
    });
})

router.post("/editheader2", function(req, res) {
    console.log(req.body);
    var mainImage = req.body.mainImage;
    var mainTitle = req.body.mainTitle;
    var mainParagraph = req.body.mainParagraph;
    var gradient = req.body.gradient;
    var link = req.body.link;
    var newHeaderPreview = {
        mainImage: mainImage,
        mainTitle: mainTitle,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    };
    Headerpreview.create(newHeaderPreview, function(err, headerPreview) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("admin/editheader2", {headerPreviews:headerPreview});
        }
    });
});


router.post('/header2add', function(req,res,next){
    Title1.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });    
    Headerpreview.findOne(function(err, headerpreviews){
        console.log(headerpreviews)
                if(err){
            console.log(err)
        } else { 
    var mainTitle = headerpreviews.mainTitle;
    var mainImage = headerpreviews.mainImage;
    var mainParagraph = headerpreviews.mainParagraph;
    var gradient = headerpreviews.gradient;
    var link = headerpreviews.link;
    var newHeader = {
        mainTitle: mainTitle,
        mainImage: mainImage,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    }
    }
    Title1.create(newHeader, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated)
            res.redirect("/");
        }
    });
    Headerpreview.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });
    });
});


router.get('/dashboard/design-aanpassen/header2', function(req, res, next){
    Title.find(function(err, foundTitle){
    User.findById(req.user.id, function(err, foundUser){
       res.render('admin/editheader2', {titles: foundTitle, users:foundUser}) 
    });
    });
})

router.post("/editheader2", function(req, res) {
    console.log(req.body);
    var mainImage = req.body.mainImage;
    var mainTitle = req.body.mainTitle;
    var mainParagraph = req.body.mainParagraph;
    var gradient = req.body.gradient;
    var link = req.body.link;
    var newHeaderPreview = {
        mainImage: mainImage,
        mainTitle: mainTitle,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    };
    Headerpreview.create(newHeaderPreview, function(err, headerPreview) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("admin/editheader2", {headerPreviews:headerPreview});
        }
    });
});


router.post('/header2add', function(req,res,next){
    Title1.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });    
    Headerpreview.findOne(function(err, headerpreviews){
        console.log(headerpreviews)
                if(err){
            console.log(err)
        } else { 
    var mainTitle = headerpreviews.mainTitle;
    var mainImage = headerpreviews.mainImage;
    var mainParagraph = headerpreviews.mainParagraph;
    var gradient = headerpreviews.gradient;
    var link = headerpreviews.link;
    var newHeader = {
        mainTitle: mainTitle,
        mainImage: mainImage,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    }
    }
    Title1.create(newHeader, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated)
            res.redirect("/");
        }
    });
    Headerpreview.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });
    });
});


router.get('/dashboard/design-aanpassen/header3', function(req, res, next){
    Title2.find(function(err, foundTitle){
    User.findById(req.user.id, function(err, foundUser){
       res.render('admin/editheader3', {titles: foundTitle, users:foundUser}) 
    });
    });
})

router.post("/editheader3", function(req, res) {
    console.log(req.body);
    var mainImage = req.body.mainImage;
    var mainTitle = req.body.mainTitle;
    var mainParagraph = req.body.mainParagraph;
    var gradient = req.body.gradient;
    var link = req.body.link;
    var newHeaderPreview = {
        mainImage: mainImage,
        mainTitle: mainTitle,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    };
    Headerpreview.create(newHeaderPreview, function(err, headerPreview) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("admin/editheader3", {headerPreviews:headerPreview});
        }
    });
});


router.post('/header3add', function(req,res,next){
    Title2.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });    
    Headerpreview.findOne(function(err, headerpreviews){
        console.log(headerpreviews)
                if(err){
            console.log(err)
        } else { 
    var mainTitle = headerpreviews.mainTitle;
    var mainImage = headerpreviews.mainImage;
    var mainParagraph = headerpreviews.mainParagraph;
    var gradient = headerpreviews.gradient;
    var link = headerpreviews.link;
    var newHeader = {
        mainTitle: mainTitle,
        mainImage: mainImage,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    }
    }
    Title2.create(newHeader, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated)
            res.redirect("/");
        }
    });
    Headerpreview.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });
    });
});

//HEADER4


router.get('/dashboard/design-aanpassen/header4', function(req, res, next){
    Title3.find(function(err, foundTitle){
    User.findById(req.user.id, function(err, foundUser){
       res.render('admin/editheader4', {titles: foundTitle, users:foundUser}) 
    });
    });
})

router.post("/editheader4", function(req, res) {
    console.log(req.body);
    var mainImage = req.body.mainImage;
    var mainTitle = req.body.mainTitle;
    var mainParagraph = req.body.mainParagraph;
    var gradient = req.body.gradient;
    var link = req.body.link;
    var newHeaderPreview = {
        mainImage: mainImage,
        mainTitle: mainTitle,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    };
    Headerpreview.create(newHeaderPreview, function(err, headerPreview) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("admin/editheader4", {headerPreviews:headerPreview});
        }
    });
});


router.post('/header4add', function(req,res,next){
    Title3.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });    
    Headerpreview.findOne(function(err, headerpreviews){
        console.log(headerpreviews)
                if(err){
            console.log(err)
        } else { 
    var mainTitle = headerpreviews.mainTitle;
    var mainImage = headerpreviews.mainImage;
    var mainParagraph = headerpreviews.mainParagraph;
    var gradient = headerpreviews.gradient;
    var link = headerpreviews.link;
    var newHeader = {
        mainTitle: mainTitle,
        mainImage: mainImage,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    }
    }
    Title3.create(newHeader, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated)
            res.redirect("/");
        }
    });
    Headerpreview.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });
    });
});


router.get('/dashboard/design-aanpassen/header5', function(req, res, next){
    Title4.find(function(err, foundTitle){
    User.findById(req.user.id, function(err, foundUser){
       res.render('admin/editheader5', {titles: foundTitle, users:foundUser}) 
    });
    });
})

router.post("/editheader5", function(req, res) {
    console.log(req.body);
    var mainImage = req.body.mainImage;
    var mainTitle = req.body.mainTitle;
    var mainParagraph = req.body.mainParagraph;
    var gradient = req.body.gradient;
    var link = req.body.link;
    var newHeaderPreview = {
        mainImage: mainImage,
        mainTitle: mainTitle,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    };
    Headerpreview.create(newHeaderPreview, function(err, headerPreview) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("admin/editheader5", {headerPreviews:headerPreview});
        }
    });
});


router.post('/header5add', function(req,res,next){
    Title4.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });    
    Headerpreview.findOne(function(err, headerpreviews){
        console.log(headerpreviews)
                if(err){
            console.log(err)
        } else { 
    var mainTitle = headerpreviews.mainTitle;
    var mainImage = headerpreviews.mainImage;
    var mainParagraph = headerpreviews.mainParagraph;
    var gradient = headerpreviews.gradient;
    var link = headerpreviews.link;
    var newHeader = {
        mainTitle: mainTitle,
        mainImage: mainImage,
        mainParagraph: mainParagraph,
        gradient: gradient,
        link: link
    }
    }
    Title4.create(newHeader, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated)
            res.redirect("/");
        }
    });
    Headerpreview.remove({}, function(err, next){
        if(err){
            console.log(err)
        } else {
            return;
        }
    });
    });
});

router.get('/dashboard/mailinglist', function(req, res, next){
    User.find(function(err, foundUsers){
       res.render('admin/mailinglist', {users: foundUsers}) 
    })
})

// router.get('/:id', function(req, res, next){
//     Product.findById(req.params.id, function(err, foundProduct){
//       res.render('shop/show', {products: foundProduct}) 
//     })
// })

router.get('/:id', function(req, res, next){
    Product.findById(req.params.id, function(err, foundProduct){
       res.render('shop/show', {products: foundProduct}) 
    })
})

router.get('/:id', function(req, res, next){
    Product.findById(req.params.id, function(err, foundProduct){
       res.render('shop/show', {products: foundProduct}) 
    })
})

router.get('/:id', function(req, res, next){
    Product.findById(req.params.id, function(err, foundProduct){
       res.render('shop/show', {products: foundProduct}) 
    })
})

router.get('/:id', function(req, res, next){
    Product.findById(req.params.id, function(err, foundProduct){
       res.render('shop/show', {products: foundProduct}) 
    })
})

router.get('/:id', function(req, res, next){
    Product.findById(req.params.id, function(err, foundProduct){
       res.render('shop/show', {products: foundProduct}) 
    })
})

//SHOW

router.get('/:id', function(req, res, next){
    Product.findById(req.params.id, function(err, foundProduct){
       res.render('shop/show', {products: foundProduct}) 
    })
})



module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
