var title         = document.querySelector('#heh')
var brand         = document.querySelector('#br')
var viewport      = document.querySelector('#vp')
var brandImg      = document.querySelector('#device-brand')
var deviceImg     = document.querySelector('#big-device-img')
var popularity    = document.querySelector('#popularity')
var header        = document.querySelector('#header');
var loader        = document.querySelector('#loader');
var max           = document.querySelector('#max')
var min           = document.querySelector('#min')
var round         = document.querySelectorAll('#round')  
var input         = document.querySelectorAll('#data')  
var output        = document.querySelectorAll('#result')  
var wrapper       = document.querySelectorAll('.brand-img')  
var list          = document.querySelector('#list') 
var size          = document.querySelectorAll('.size') 
var listItem      = [].slice.call(document.querySelectorAll("#list-item"));
var newIndex      = 17;
var k             = -1;
var x             = 18;
var itemAdded     = 0
var resultIndex   = 0
var timesLoaded   = 0
var renderedLists = [];
var checkList     = [];
var res           = {};

function showResult(str) {
    showLoader()
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "/device/"+str, true );
    xmlHttp.setRequestHeader("Content-Type", "json");
    xmlHttp.send( null );
    xmlHttp.onload = function(e) { 
    if (this.status == 200) {
       var result = JSON.parse(this.responseText)
       var widthHeight = result.device.viewport.split('x', 4)
       title.innerHTML = result.device.title;
       viewport.innerHTML = result.device.viewport;
       deviceImg.src = result.device.img;
       popularity.innerHTML = result.device.popularity;
       min.innerHTML = widthHeight[0] + 'px'
       max.innerHTML = widthHeight[1] + 'px'
    }
    hide()
};
}
function showLoader(){
    loader.style.display = 'block';
    // setTimeout(hide, 700);
}

function hide(){
    loader.style.display = 'none';
}

// $(window).load('/ #header', function hideLoader() {
//     loader.style.display = 'none';
//     // alert('hey')
// })

window.onload = function onLoadWindow(){
    deviceCheck()
    roundNumber()
}


function deviceCheck(){
    for(var y = 0; y < input.length ; y++){
    let data = input[y].currentSrc
    if(data === "https://i.imgur.com/Q35qRQD.png"){
    output[y].innerHTML = "Smartphones"
    } else if(data === "https://i.imgur.com/DJo7vLI.png"){
    output[y].innerHTML = "Tablets"
    } else if(data === "https://i.imgur.com/A0KkPfg.png"){
    output[y].innerHTML = "Laptops"
    } else {
    output[y].innerHTML = "Monitors"
    }
    } 
}

function roundNumber(){
    for(var y = 0; y < round.length ; y++){
        round[y].innerHTML = Math.round(round[y].innerHTML)
        round[y].style.display = 'inline'
    } 
}

$(function (){
    $('#list').scroll(function() {
        if($('#list').scrollTop() > 900 * timesLoaded -100)  {
        timesLoaded++
        getChunk(timesLoaded)
    }
    });
});

function loadMore(ID, dropDown){
    renderList(ID, dropDown)
}



async function getChunk(timesLoaded){
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "/load/" + timesLoaded , true );
    xmlHttp.setRequestHeader("Content-Type", "json");
    xmlHttp.send( null );
    xmlHttp.onload = function(e) { 
        if (this.status == 200) {
            var result = JSON.parse(this.responseText);    
            console.log(result)
      result.forEach(function(elem,index){
      var promise = new Promise(function(resolve, reject){
          insertHTML(list)
        resolve();
      }).then(function(){
        newIndex++
        document.querySelectorAll('.brand')[newIndex].innerHTML = result[index].title.replace(/"/g,"")
        document.querySelectorAll('#list-img') [newIndex].style.backgroundImage = 'url(' + result[index].img + ')'
        document.querySelectorAll('#list-popularity')  [newIndex].innerHTML = result[index].popularity
        document.querySelectorAll('.viewport')[newIndex].innerHTML = result[index].viewport.replace(/"/g,"")
        document.querySelectorAll('.date')[newIndex].innerHTML = result[index].date.replace(/[^0-9.]/g, "");;
        document.querySelectorAll('.onClick')[newIndex -1].onclick = function(){ 
            showResult(result[index]._id)
                };
            });
        });
    }
}
}

function se(re) { 
  if(re){
  return re.ID === res.ID;    
  } else {
    return undefined;
  }
}


function check(ID,dropDown){
    res               = {"ID":ID,"timesLoaded":0}
    var result        = checkList.find(se);
    console.log(checkList)
    if(result === undefined){
        console.log('1');
        save()
        incrementTimesLoaded()
        renderList(res.ID, dropDown, res.timesLoaded)
    } else if(result.ID !== res.ID ){
        console.log('2');
        save()
        incrementTimesLoaded()
        renderList(res.ID, dropDown, res.timesLoaded)
    } else if(result.ID === res.ID){
        console.log('3');
        incrementTimesLoaded()
        renderList(res.ID, dropDown,res.timesLoaded)
    }
}

function incrementTimesLoaded(){
   var i = checkList.map(function(e) {return e.ID;}).indexOf(res.ID); 
   checkList[i].timesLoaded += 1; 
}

function save(){
   return checkList.push(res) 
}


function renderList(ID, dropDown, timesLoaded){
    var i                      = 0;
    var t                      = false;
    var r                      = false;
    var xmlHttp                = null;
    xmlHttp                    = new XMLHttpRequest();
    xmlHttp.open               ( "GET", "/sizes/" + ID + '/' + timesLoaded, true );
    xmlHttp.setRequestHeader   ("Content-Type", "json");
    xmlHttp.send               ( null );
    xmlHttp.onload = function(e) { 
        if (this.status == 200) {
            var result = JSON.parse(this.responseText);
            result.forEach(function(elem,index){
              var promise = new Promise(function(resolve, reject){
                  document.querySelector("#_"+dropDown).insertAdjacentHTML('beforeend',' <div class="list-item"><div class="row px-5 onClick"><div class="col-1 list-img"  ></div><div class="col"><h6 class="brandSize"></h6></div><div class="col-3 viewport"><h6></h6></div><div class="col-2 date"><h6></h6></div><div class="col-1 text-right"><h6><span class="badge badge-success list-popularity"></span><br></h6></div></div></div> ')
                  resolve();
                  }).then(function(){ 
                    var current = ($("#_"+dropDown));
                    if(timesLoaded === 1 && r === false){
                        console.log('if')
                    k = 1;
                    r = true
                    } else if (t === false && r === false) {
                        console.log('else')
                    k = k + (17 * timesLoaded);
                    console.log(k +' + (17 * timesLoaded) = 1 + ' + (17 + timesLoaded + 1))
                    t = true
                    }
                    k++
                    console.log(k)
                    current.find('.brandSize')[k].innerHTML = result[index].title.replace(/"/g,"");
                    current.find('.list-img')[k].style.backgroundImage = 'url(' + result[index].img + ')';
                    current.find('.list-popularity')[k].innerHTML = result[index].popularity;
                    current.find('.viewport')[k].innerHTML = result[index].viewport.replace(/"/g,"");
                    current.find('.date')[k].innerHTML = result[index].date.replace(/[^0-9.]/g, "");
                    current.find('.onClick')[k].onclick = function(){ 
                    showResult(result[index]._id);
                };
            });
        });
    }
}
}

function insertHTML(source){
    source.insertAdjacentHTML('beforeend',' <div class="list-item"><div class="row px-5 onClick"><div class="col-1" id="list-img" ></div><div class="col"><h6 class="brand"></h6></div><div class="col-3 viewport"><h6></h6></div><div class="col-2 date"><h6></h6></div><div class="col-1 text-right"><h6><span class="badge badge-success" id="list-popularity"></span><br></h6></div></div></div> ')
}





// var checkList = [];
// var res = {};

// function se(re) { 
//   if(re){
//   return re.ID === res.ID;    
//   } else {
//     return undefined;
//   }
// }

// function check(ID,dropDown){
//     res = {"ID":ID,"timesLoaded":1}
//     var result = checkList.find(se);
//     if(result !== res){
//         checkList.push(res)
//         renderList(res, dropDown)
//         console.log(res)
//     } else {
//     var dropDownHeigt = document.querySelector("#_"+dropDown).style.height
//         if(dropDownHeigt > "0px"){
//         dropDownHeigt = "0px";
//         } else {
//         dropDownHeigt = "300px"
//         }
//     }
// }
