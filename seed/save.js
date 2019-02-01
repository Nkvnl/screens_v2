
function save(){
  for(var x = 0; x < 100 ;x++){
    if(JSON.stringify(Device[z].viewport) === JSON.stringify(resolutions[y].viewport)){
        z++
        recentMatches++
        console.log('matched at z = ' + z)
    } else if(JSON.stringify(Device[z]) !== JSON.stringify(resolutions[y]) && recentMatches > 0) {
        if(recentMatches === 1){
            console.log(recentMatches)
        newDevices.splice(0,0,(Device.slice(w,z)));
        console.log('saved 1 at z = ' + z + '/ w = ' + w + JSON.stringify(Device.slice(w,z)))
        w = z;
        z++
        recentMatches = 0
        } else {
            console.log(recentMatches)
        Device.splice(0,0,(Device.slice(w,z)));
        console.log('saved multiple at z = ' + z + '/ w = ' + w + JSON.stringify(Device.slice(w,z)))
        recentMatches = 0
        w = z;
        z++
        }
    } else if(z >= Device.length -1) {
        y++;
        // a = a + z
        z = 0;
        console.log('Incremented y at z = ' + z)
    } else {
        console.log('else increment z = ' + z)
    z++
    } 
console.log(x + "x")
console.log(y + "y")
console.log(z + "z")
console.log(w + "w")
console.log(JSON.stringify(resolutions[y]) + " = Current resolution")
console.log(Device.length + " = devices.length")
console.log(newDevices.length + " = newDevices.length")
}
console.log(newDevices)
}

////////////////////////////////////////////////////V2
function save(){
  for(x = 0; x < 1000; x++){    // Loop through all devices
  console.log('y = '+y)
  console.log('x = '+x)
    if(JSON.stringify(Device[x].viewport) === JSON.stringify(resolutions[y].viewport && x < 166)){
        indexArr.splice(1,0,[x,x+1])
        console.log('Match')
        // console.log(Device[x])
    } else if(x >= 166) {
        indexArr.forEach(function(result){
        var index = Device.slice(result[0],result[1]);
        indexArr1.push(index);
        })
        newDevices.splice(1,0,indexArr1)
        indexArr = [];
        indexArr1 = [];
        x = 0;
        y++
        console.log('Reset')
    } else {
        console.log('No match')
        console.log(x)
        // z++
    }
  }
  return console.log('Done')
}


<script>



var recentMatches = 0
var resolutions = [{viewport:"900x1400"},{viewport:"768x1366"},{viewport:"800x1280"},{viewport:"900x1600"},{viewport:"414x896"},{viewport:"360x740"},{viewport:"412x846"},{viewport:"414x736"},{viewport:"3840x2160"},{viewport:"1366x768"},{viewport:"800x600"},{viewport:"412x738"},{viewport:"768x1280"},{viewport:"1280x720"},{viewport:"1024x1366"},{viewport:"1200x1920"},{viewport:"1440x2560"},{viewport:"1600x2560"},{viewport:"1600x900"},{viewport:"1800x2880"},{viewport:"1440x2304"},{viewport:"1600x1200"},{viewport:"2049x1536"},{viewport:"2160x1440"},{viewport:"2560x1600"},{viewport:"2880x5120"},{viewport:"320x570"},{viewport:"2160x3840"},{viewport:"2560x1440"},{viewport:"2736x1824"},{viewport:"360x640"},{viewport:"320x568"},{viewport:"375x667"},{viewport:"4096x2304"},{viewport:"2412x823"},{viewport:"393x786"},{viewport:"375x812"},{viewport:"1024x600"},{viewport:"411x731"},{viewport:"1280x768"},{viewport:"1280x800"},{viewport:"2000x3000"},{viewport:"850x1280"},{viewport:"900x600"},{viewport:"1024x768"},{viewport:"1080x1920"},{viewport:"1050x1680"},{viewport:"240x320"},];

var Device = [
 {viewport:"900x1400"},
{viewport:"768x1366"},
{viewport:"800 x1280"},
{viewport:"900x1600"},
{viewport:"360x640"},
{viewport:"768x1366"},
{viewport:"800x1280"},
{viewport:"375x667"},
{viewport:"412x846"},
{viewport:"414x896"},
{viewport:"1024x600"},
{viewport:"768x1366"},
{viewport:"800x1280"},
{viewport:"360x740"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"375x667"},
{viewport:"360x640"},
{viewport:"375x812"},
{viewport:"412x846"},
{viewport:"414x736"},
{viewport:"1024x768"},
{viewport:"768x1366"},
{viewport:"3840x2160"},
{viewport:"414x736"},
{viewport:"1366x768"},
{viewport:"800x600"},
{viewport:"768x1366"},
{viewport:"412x738"},
{viewport:"414x736"},
{viewport:"1366x768"},
{viewport:"800x1280"},
{viewport:"900x1400"},
{viewport:"800x1280"},
{viewport:"768x1366"},
{viewport:"360x640"},
{viewport:"768x1280"},
{viewport:"375x667"},
{viewport:"768x1280"},
{viewport:"1200x1920"},
{viewport:"1024x768"},
{viewport:"1024x768"},
{viewport:"1080x1920"},
{viewport:"1280x720"},
{viewport:"1024x1366"},
{viewport:"1080x1920"},
{viewport:"1280x800"},
{viewport:"1024x768"},
{viewport:"1080x1920"},
{viewport:"1280x800"},
{viewport:"1200x1920"},
{viewport:"1280x800"},
{viewport:"1440x2560"},
{viewport:"1280x800"},
{viewport:"1600x2560"},
{viewport:"1280x800"},
{viewport:"1280x800"},
{viewport:"1280x800"},
{viewport:"1440x2560"},
{viewport:"1600x2560"},
{viewport:"1080x1920"},
{viewport:"1600x900"},
{viewport:"1800x2880"},
{viewport:"1366x768"},
{viewport:"1600x2560"},
{viewport:"1800x2880"},
{viewport:"1440x2304"},
{viewport:"1600x1200"},
{viewport:"1080x1920"},
{viewport:"1080x1920"},
{viewport:"1080x1920"},
{viewport:"1080x1920"},
{viewport:"2049x1536"},
{viewport:"1080x1920"},
{viewport:"2160x1440"},
{viewport:"2160x3840"},
{viewport:"2160x4096"},
{viewport:"2560x1600"},
{viewport:"2560x1600"},
{viewport:"2880x5120"},
{viewport:"320x570"},
{viewport:"2160x3840"},
{viewport:"2560x1440"},
{viewport:"2560x1440"},
{viewport:"2560x1440"},
{viewport:"2736x1824"},
{viewport:"2736x1824"},
{viewport:"360x640"},
{viewport:"320x568"},
{viewport:"320x568"},
{viewport:"360x740"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x740"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"375x667"},
{viewport:"4096x2304"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"2412x823"},
{viewport:"393x786"},
{viewport:"375x812"},
{viewport:"1024x600"},
{viewport:"360x640"},
{viewport:"411x731"},
{viewport:"1080x1920"},
{viewport:"1080x1920"},
{viewport:"1280x768"},
{viewport:"1280x800"},
{viewport:"2000x3000"},
{viewport:"850x1280"},
{viewport:"900x600"},
{viewport:"900x1400"},
{viewport:"1024x600"},
{viewport:"1024x600"},
{viewport:"1024x600"},
{viewport:"1024x600"},
{viewport:"1024x768"},
{viewport:"1024x600"},
{viewport:"1024x768"},
{viewport:"1024x768"},
{viewport:"1080x1920"},
{viewport:"1024x600"},
{viewport:"1024x768"},
{viewport:"1050x1680"},
{viewport:"1024x600"},
{viewport:"1280x800"},
{viewport:"1280x800"},
{viewport:"1280x800"},
{viewport:"1280x800"},
{viewport:"1080x1920"},
{viewport:"1280x800"},
{viewport:"1280x800"},
{viewport:"1080x1920"},
{viewport:"2049x1536"},
{viewport:"1080x1920"},
{viewport:"2049x1536"},
{viewport:"240x320"},
{viewport:"320x570"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"2560x1600"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"360x640"},
{viewport:"320x570"}   
];

var newDevices = []
var indexArr = []
var indexArr1 = []
var y = 0
var z = 0
var w = 0
var x = 0

function save(){
  for(x = 0; y < 47 ; x++){    // Loop through all devices
//   console.log('y = '+y)
  console.log('x = '+x)
    if(x < 167 && JSON.stringify(Device[x].viewport) === JSON.stringify(resolutions[y].viewport)){
        indexArr.splice(1,0,[x,x+1])
        // console.log('Match' + JSON.stringify(Device[x].viewport) + JSON.stringify(resolutions[y].viewport))
        // console.log(Device[x])
        console.log('matched')
    } else if(x >= 166) {
        indexArr.forEach(function(result){
        var index = Device.slice(result[0],result[1]);
        indexArr1.push(index);
        })
        newDevices.splice(1,0,indexArr1)
        indexArr = [];
        indexArr1 = [];
        x = 0;
        y++
        // console.log('Reset')
    } else {
        // console.log('No match')
        // console.log(x)
        // z++
    }
  console.log('Done')
  }
}
</script>



////////////////////////////////////v3/////
app.get('/sizes', function(req, res, next){
  Devices.find(function(err, Device){
    if(err){
      console.log(err)
    } else {
  for(x = 0; y < 47 ; x++){    // Loop through all devices
  // console.log('y = '+y)
  console.log('x = '+x)
    if(x < 165 && JSON.stringify(Device[x].viewport) === JSON.stringify(resolutions[y].viewport)){
        indexArr.splice(1,0,[x,x+1])
        // console.log('Match' + JSON.stringify(Device[x].viewport) + JSON.stringify(resolutions[y].viewport))
        // console.log(Device[x])
        // console.log('matched')
    } else if(x >= 165) {
        indexArr.forEach(function(result){
        var index = Device.slice(result[0],result[1]);
        indexArr1.push(index);
        })
        newDevices.splice(1,0,indexArr1)
        indexArr = [];
        indexArr1 = [];
        x = 0;
        y++
        // console.log('Reset')
    } else {
        // console.log('No match')
        // console.log(x)
        // z++
    }
  }
  }
});
  console.log(newDevices)
    res.render('size',{newDevices: newDevices.viewport});
})
