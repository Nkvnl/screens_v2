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
       title.innerHTML = result.device.title;
       viewport.innerHTML = result.device.viewport;
       deviceImg.src = result.device.img;
       popularity.innerHTML = result.device.popularity;
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
        let title = result[index].title.replace(/"/g,"");
        let img = result[index].img;
        let viewport = result[index].viewport.replace(/"/g,"");
        let popularity = result[index].popularity;
        let date = result[index].date.replace(/[^0-9.]/g, "");
        let click = result[index]._id;
        insertHTML(list,title,img,popularity,date,click,viewport)  
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


function check(ID,dropDown,reqType){
    res               = {"ID":ID,"timesLoaded":0}
    var result        = checkList.find(se);
    console.log(checkList)
    if(result === undefined){
        console.log('1');
        save()
        incrementTimesLoaded()
        renderList(checkList[0].ID, dropDown, checkList[0].timesLoaded - 1, reqType)
    } else if(result.ID !== res.ID ){
        console.log('2');
        save()
        incrementTimesLoaded()
        renderList(checkList[0].ID, dropDown, checkList[0].timesLoaded - 1, reqType)
    } else if(result.ID === res.ID){
        console.log('3');
        incrementTimesLoaded()
        renderList(checkList[0].ID, dropDown,checkList[0].timesLoaded - 1, reqType)
    }
}

function incrementTimesLoaded(){
   var i = checkList.map(function(e) {return e.ID;}).indexOf(res.ID); 
   checkList[i].timesLoaded += 1; 
}

function save(){
   return checkList.unshift(res) 
}


function renderList(ID, dropDown, timesLoaded, reqType){
    console.log(timesLoaded)
    var xmlHttp                = null;
    xmlHttp                    = new XMLHttpRequest();
    xmlHttp.open               ( "GET", reqType + ID + '/' + timesLoaded, true );
    xmlHttp.setRequestHeader   ("Content-Type", "json");
    xmlHttp.send               ( null );
    xmlHttp.onload = function(e) { 
        console.log(result)
        var result = JSON.parse(this.responseText);
        if(result === "End of list"){
            return 'End of list'  
        } else {
            result.forEach(function(elem,index){
            let current = document.querySelector("#_"+dropDown);
            let title = result[index].title.replace(/"/g,"");
            let img = result[index].img;
            let viewport = result[index].viewport.replace(/"/g,"");
            let popularity = result[index].popularity;
            let date = result[index].date.replace(/[^0-9.]/g, "");
            let click = result[index]._id;
            insertHTML(current,title,img,popularity,date,click,viewport)                  
            });
        }
    }
}


// function insertHTML(source){
//     console.log(source)
//     source.insertAdjacentHTML('beforeend',' <div class="list-item"><div class="row px-5 onClick"><div class="col-1" id="list-img" ></div><div class="col"><h6 class="brand"></h6></div><div class="col-3 viewport"><h6></h6></div><div class="col-2 date"><h6></h6></div><div class="col-1 text-right"><h6><span class="badge badge-success" id="list-popularity"></span><br></h6></div></div></div> ')
// }


function insertHTML(source,title,img,popularity,date,click,viewport){
    source.insertAdjacentHTML(
      'beforeend',
      '<div class="list-item"><div class="row px-5 onClick" onclick="showResult('+"'"+click+"'"+');"><div class="col-1" id="list-img" style="background:url('+ img +');"></div><div class="col"><h6 class="brand">' + title + '</h6></div><div class="col-3 viewport">' + viewport + '<h6></h6></div><div class="col-2 date">' + date + '<h6></h6></div><div class="col-1 text-right"><h6><span class="badge badge-success" id="list-popularity">' + popularity + '</span><br></h6></div></div></div> '
                             )
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
