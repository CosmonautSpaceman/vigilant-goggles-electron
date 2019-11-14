const {app, BrowserWindow} = require('electron') 
const url = require('url') 
const path = require('path')  

let win  

function createWindow() { 
   var python = require('child_process').spawn('python', ['./python-engine/main.py']);
//   python.stdout.on('data',function(data){
//      console.log("data: ",data.toString('utf8'));
//   });
   var rq = require('request-promise');
   var mainAddr = 'http://localhost:5000';
   

   var loadWindow = function(){
      win = new BrowserWindow({width: 800, height: 600}) 
      // win.loadURL(url.format ({ 
      //    pathname: path.join(__dirname, 'index.html'), 
      //    protocol: 'file:', 
      //    slashes: true 
      // })) 
      win.loadURL('http://localhost:5000');
      win.webContents.openDevTools();
      win.on('closed', function() {
        win= null;
      python.kill('SIGINT');
    });
   };

   var startUp = function(){
      rq(mainAddr)
        .then(function(htmlString){
          console.log('server started!');
          loadWindow();
        })
        .catch(function(err){
          //console.log('waiting for the server start...');
          startUp();
        });
    };
    startUp();
}  

// fire!

app.on('ready', createWindow) 
