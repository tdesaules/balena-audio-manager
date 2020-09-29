<script lang="javascript">

  import * as io from 'socket.io-client';
  import '../../node_modules/materialize-css/dist/js/materialize.min.js';

  var socket = io();
  let deviceName = '';
  let devices = [];
  let applicationName = '';
  let realtime = false;
  let audio = false;
  let manage = false;
  let services = [];

  socket.on('device name', function(data){ deviceName = data });
  
  socket.on('application name', function(data){ applicationName = data });
  
  socket.on('devices', function(data){ devices = data });

  socket.on('services', function(data){ services = data });
  
  socket.on('notification', function(data){ M.toast({html: data, classes: 'rounded'}) });

  function handleRealtime() { socket.emit('realtime', realtime) }

  function showAudio() {
    audio = true;
    manage = false;
  }

  function showManage() {
     manage = true;
     audio = false;
  }

  function handleDeviceReboot() { socket.emit('reboot device') }

  function handleDeviceRestart() { socket.emit('restart services') }

  function handleAllReboot() { socket.emit('reboot all devices') }

  function handleAllRestart() { socket.emit('restart all services') }

  function handleServiceStart(imageID) { socket.emit('start service', imageID) }

  function handleServiceStop(imageID) { socket.emit('stop service', imageID) }

  function handleServiceRestart(imageID) { socket.emit('restart service', imageID) }

</script>

<style lang="scss">

  .has-left-margin {
    margin-left: 1em; 
  }

  .has-margin {
    margin: 1em;
  }

  .white-checkbox[type="checkbox"].filled-in:checked + span:not(.lever):after {
    border: 2px solid #ffffff;  
    background-color: #9e9e9e;
  }
  .white-checkbox[type="checkbox"].filled-in + span:not(.lever):after {
    border: 2px solid #ffffff;  
    background-color:transparent;
  }

</style>

<nav>
  <div class="nav-wrapper">
    <span class="brand-logo has-left-margin">{deviceName}</span>
    <ul id="nav-mobile" class="right hide-on-med-and-down">
      <li><a on:click={showManage} href="#!">manage</a></li>
      <li><a on:click={showAudio} href="#!">audio</a></li>
    </ul>
  </div>
</nav>

<div class="container">
  <div class="row">
    <div class="col s12 m12 l12 x12 grey-text center-align has-margin">
      <div class="switch">
        <label>
          realtime : &#8205; &#8205; &#8205; off
          <input type=checkbox bind:checked={realtime} on:click={handleRealtime}>
          <span class="lever"></span>
          on
        </label>
      </div>
    </div>
  </div>
</div>

{#if manage}
  <div class="container">
    <div class="row">
      <div class="col s6 m6 l6 xl6">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title"><h5>device ({deviceName})</h5></span>
            <p>manage device reboot it (hardware reboot) or restart all services</p>
          </div>
          <div class="card-action center-align">
            <button class="waves-effect waves-light btn" on:click={handleDeviceReboot}>reboot</button>
            <button class="waves-effect waves-light btn" on:click={handleDeviceRestart}>restart</button>
          </div>
        </div>
      </div>
      <div class="col s6 m6 l6 xl6">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title"><h5>application ({applicationName})</h5></span>
            <p>manage all devices reboot it (hardware reboot) or restart all services from all devices</p>
          </div>
          <div class="card-action center-align">
            <button class="waves-effect waves-light btn" on:click={handleAllReboot}>reboot</button>
            <button class="waves-effect waves-light btn" on:click={handleAllRestart}>restart</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col s12 m12 l12 xl12">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title"><h5>service</h5></span>
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>image-id</th>
                  <th>name</th>
                  <th>status</th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                {#each services as service}
                  <tr>
                    <td>{service.id}</td>
                    <td>{service.image_id}</td>
                    <td>{service.name}</td>
                    <td>{service.status}</td>
                    <td>
                      <button class="waves-effect waves-red red lighten-2 btn" on:click={handleServiceStop(service.image_id)}>stop</button>
                      <button class="waves-effect waves-teal teal lighten-2 btn" on:click={handleServiceStart(service.image_id)}>start</button>
                      <button class="waves-effect waves-orange orange lighten-2 btn" on:click={handleServiceRestart(service.image_id)}>restart</button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if} {#if audio}
  <div class="container">
    <div class="row">
      <div class="col s6 m6 l6 xl6">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title"><h5>multiroom</h5></span>
            <table>
              <thead>
                <tr>
                  <th>name</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody>
                {#each devices as device}
                  <tr>
                    <td>
                      <label>
                        <input class="white-checkbox filled-in" type="checkbox" />
                        <span class="white-text">{device.name}</span>
                      </label>
                    </td>
                    <td>{device.status}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <div class="card-action center-align">
            <button class="waves-effect waves-light btn">create</button>
          </div>
        </div>
      </div>
      <div class="col s6 m6 l6 xl6">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title"><h5>stream</h5></span>
            <p>

            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}