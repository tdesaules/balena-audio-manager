// DEFINE VAR -------------------------------------------------------------------------------------------------------- //

const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

app.use(serve('dist'));

const server = require('http').createServer(app.callback())
const io = require('socket.io')(server);

const getSdk = require('balena-sdk');
const balena = getSdk({ apiUrl: process.env.BALENACLOUD_API_URL });

const jsonrpc = require('jsonrpc-lite');
const fetch = require("node-fetch");

var uuid = "empty";
var intervalid = null;
var myservices = [];
var mydevices = [];


// INIT BALENA CLOUD ------------------------------------------------------------------------------------------------- //

// auth to Balena cloud
balena.auth.isLoggedIn(function(error, isLoggedIn) {
  if (error) throw error;
  if (isLoggedIn) {
    balena.auth.whoami(function(error, username) {
      if (error) throw error;
      console.log('Connected to Balena Cloud with username:', username);
    });
  } else {
    console.log('Not Connected to Balena Cloud');
    balena.auth.loginWithToken(process.env.BALENACLOUD_API_KEY, function(error) {
      if (error) throw error;
      balena.auth.whoami(function(error, username) {
        if (error) throw error;
        console.log('Connected to Balena Cloud with username:', username);
      });
    });
  }
});

// CORE APP -----------------------------------------------------------------------------------------------------------//

io.on('connection', function (socket) {
  console.log('socket.io connected');
  socket.emit('device name', process.env.SNAPCAST_DEVICE_NAME);
  socket.emit('application name', process.env.BALENA_APP_NAME);
  balena.models.device.getAllByApplication(process.env.BALENA_APP_NAME).then(function(devices) {
    mydevices = [];
    devices.forEach(function(device) {
      let mydevice = {id:device.id, name:device.device_name, uuid:device.uuid, status:device.status, is_online:device.is_online, ip_address:device.ip_address, };
      mydevices.push(mydevice);
      if (device.device_name == process.env.BALENA_DEVICE_NAME_AT_INIT) {
        balena.models.device.getWithServiceDetails(device.id).then(function(device) {
          myservices = [];
          Object.keys(device.current_services).forEach(function(serviceName) {
            let myservice = {name:serviceName, status:device.current_services[serviceName][0].status, id:device.current_services[serviceName][0].id, image_id:device.current_services[serviceName][0].image_id};
            myservices.push(myservice);
          });
          socket.emit('services', myservices);
        });
      }
    });
    socket.emit('devices', mydevices);
  });
  socket.on('realtime', function(realtime) {
    if (!realtime) {
      socket.emit('notification', 'enable realtime');
      intervalid = setInterval(function(){
        balena.models.device.getAllByApplication(process.env.BALENA_APP_NAME).then(function(devices) {
          devices.forEach(function(device) {
            if (device.device_name == process.env.BALENA_DEVICE_NAME_AT_INIT) {
              balena.models.device.getWithServiceDetails(device.id).then(function(device) {
                myservices = [];
                Object.keys(device.current_services).forEach(function(serviceName) {
                  let service = {name:serviceName, status:device.current_services[serviceName][0].status, id:device.current_services[serviceName][0].id, image_id:device.current_services[serviceName][0].image_id};
                  myservices.push(service);
                });
                socket.emit('services', myservices);
              });
            }
          });
        });
      }, 2000);
    } else {
      if (intervalid) {
        socket.emit('notification', 'disable realtime');
        clearInterval(intervalid);
      }
    }
  });
  socket.on('reboot device', function(){
    balena.models.device.getAllByApplication(process.env.BALENA_APP_NAME).then(function(devices) {
      devices.forEach(function(device) {
        if (device.device_name == process.env.BALENA_DEVICE_NAME_AT_INIT) {
          let notification = 'reboot device : ' + device.device_name;
          socket.emit('notification', notification);
          balena.models.device.reboot(device.id);
        }
      });
    });
  });
  socket.on('restart services', function(){
    balena.models.device.getAllByApplication(process.env.BALENA_APP_NAME).then(function(devices) {
      devices.forEach(function(device) {
        if (device.device_name == process.env.BALENA_DEVICE_NAME_AT_INIT) {
          let notification = 'restart all service on : ' + device.device_name;
          socket.emit('notification', notification);
          balena.models.device.restartApplication(device.id);
        }
      });
    });
  });
  socket.on('reboot all devices', function(){
    balena.models.application.getAll(function(error, applications) {
      applications.forEach(function(application) {
        if (application.app_name == process.env.BALENA_APP_NAME) {
          let notification = 'reboot all devices for : ' + application.app_name;
          socket.emit('notification', notification);
          balena.models.application.reboot(application.id);
        }
      });
    });
  });
  socket.on('restart all services', function(){
    balena.models.application.getAll(function(error, applications) {
      applications.forEach(function(application) {
        if (application.app_name == process.env.BALENA_APP_NAME) {
          let notification = 'restart all services for : ' + application.app_name;
          socket.emit('notification', notification);
          balena.models.application.restart(application.id);
        }
      });
    });
  });
  socket.on('stop service', function(imageID){
    balena.models.device.getAllByApplication(process.env.BALENA_APP_NAME).then(function(devices) {
      devices.forEach(function(device) {
        if (device.device_name == process.env.BALENA_DEVICE_NAME_AT_INIT) {
          balena.models.device.stopService(device.id, imageID).then(function() {
            balena.models.device.getWithServiceDetails(device.id).then(function(device) {
              Object.keys(device.current_services).forEach(function(serviceName) {
                if (device.current_services[serviceName][0].image_id == imageID) {
                  var notification = 'service ' + serviceName + ' is stopping on ' + process.env.BALENA_DEVICE_NAME_AT_INIT
                  socket.emit('notification', notification);
                }
              });
            });
          });
        }
      });
    });
  });
  socket.on('start service', function(imageID){
    balena.models.device.getAllByApplication(process.env.BALENA_APP_NAME).then(function(devices) {
      devices.forEach(function(device) {
        if (device.device_name == process.env.BALENA_DEVICE_NAME_AT_INIT) {
          balena.models.device.startService(device.id, imageID).then(function() {
            balena.models.device.getWithServiceDetails(device.id).then(function(device) {
              Object.keys(device.current_services).forEach(function(serviceName) {
                if (device.current_services[serviceName][0].image_id == imageID) {
                  var notification = 'service ' + serviceName + ' is starting on ' + process.env.BALENA_DEVICE_NAME_AT_INIT
                  socket.emit('notification', notification);
                }
              });
            });
          });
        }
      });
    });
  });
  socket.on('restart service', function(imageID){
    balena.models.device.getAllByApplication(process.env.BALENA_APP_NAME).then(function(devices) {
      devices.forEach(function(device) {
        if (device.device_name == process.env.BALENA_DEVICE_NAME_AT_INIT) {
          balena.models.device.restartService(device.id, imageID).then(function() {
            balena.models.device.getWithServiceDetails(device.id).then(function(device) {
              Object.keys(device.current_services).forEach(function(serviceName) {
                if (device.current_services[serviceName][0].image_id == imageID) {
                  var notification = 'service ' + serviceName + ' is restarting on ' + process.env.BALENA_DEVICE_NAME_AT_INIT
                  socket.emit('notification', notification);
                }
              });
            });
          });
        }
      });
    });
  });
  socket.on('disconnect', function(){ console.log('socket.io disconnected') });
});

var myjson = jsonrpc.request('1', 'Client.GetStatus', {"id":"b8:27:eb:eb:59:68"});

fetch('http://192.168.100.226:1780/jsonrpc', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify(myjson),
})
.then(response => response.json())
.then(function(response) {
  console.log(response.result.client.config);
});

//balena.models.device.restartService(2910251, 2296310).then(function() {
//  console.log('restart snapcast !')
//});

// HTTP SERVER --------------------------------------------------------------------------------------------------------//

// http server on 3000
server.listen(3000, function () {
  console.log('Server listening on port 3000\n');
});