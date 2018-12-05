var Product = require('../models/product');
var Title = require('../models/title');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

// var products = [
//     new Product({
//         imagePath: 'https://www.seventyfive.com/cdn/uploads/2018/11/Nike-air-max-1-875844-010-1-300x169.jpg',
//         title: 'Nike Air Mac 1 Premium',
//         description: 'The Nike Air Max 1 gave the world its first glimpse of Nike Air cushioning back in 1987...',
//         price: 139.99
//     }),
//     new Product({
//         imagePath: 'https://www.seventyfive.com/cdn/uploads/2017/02/Adidas-350groen-01-300x169.jpg',
//         title: 'Adidas 350',
//         description: 'This version of the iconic adidas 350 shoe adds earth-tone detailing to its minimalist look.',
//         price: 79.99
//     }),
//     new Product({
//         imagePath: 'https://www.seventyfive.com/cdn/uploads/2016/12/Nike-Berwuda-obsidian-1-300x169.jpg',
//         title: 'Nike Air Berwuda Premium',
//         description: 'The Nike Air Berwuda Premium Men’s Shoe reinvents an iconic silhouette with a sleek combination upper.',
//         price: 35.99
//     }),
//     new Product({
//         imagePath: 'https://www.seventyfive.com/cdn/uploads/2016/11/Converse-asct70groen-1-300x169.jpg',
//         title: 'Converse Chuck Taylor All Star 70',
//         description: 'The Converse All Star Chuck ’70 is the re-crafted sneaker that uses modern details to celebrate...',
//         price: 109.99
//     }),
//     new Product({
//         imagePath: 'https://www.seventyfive.com/cdn/uploads/2016/12/Vans-oldskool-BB-1-300x169.jpg',
//         title: 'Vans Old Skool',
//         description: 'Vans The Old Skool, Vans classic skate shoe and the first to bare the iconic side stripe...',
//         price: 79.99
//     }),
//     new Product({
//         imagePath: 'https://www.seventyfive.com/cdn/uploads/2016/10/adidas-equip-support-grijs-1-300x169.jpg',
//         title: 'Adidas Equipment Support 93/16',
//         description: 'Originally released in 1993, The Equipment Running Support shoes were the forward-looking design of their time....',
//         price: 59.99
//     })    
// ];

var title = [
    new Title({
        mainImage: 'https://images.pexels.com/photos/1503009/pexels-photo-1503009.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        mainTitle: 'Hello World!',
        mainParagraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque, officiis.',
        gradient:'0.4',
        link:"'/dashboard"
    }),
];

var done = 0;
for (var i = 0; i < title.length; i++) {
    console.log(title[i]);
    title[i].save(function(err, result) {
        if(err){
            console.log(err)
        } else {
        done++;
        if (done === title.length) {
            exit();
        }
    }});
}

// var done = 0;
// for (var i = 0; i < products.length; i++) {
//     products[i].save(function(err, result) {
//         if(err){
//             console.log(err)
//         } else {
//         done++;
//         if (done === products.length) {
//             exit();
//         }
//         }
//     });
// }

function exit() {
    mongoose.disconnect();
}