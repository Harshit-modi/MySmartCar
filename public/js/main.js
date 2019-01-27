/* eslint-env jquery, browser */
$(document).ready(() => {

  var url = window.location.href;
  var arr = url.split("/");
  var app_origin = arr[0] + "//" + arr[2];
  let token, clientID;

  const smartcar = new Smartcar({
    clientId: 'a0a02014-6562-4f13-8e1b-9fcdc23711f3',
    redirectUri: 'https://javascript-sdk.smartcar.com/redirect-2.0.0?app_origin=' + app_origin,
    scope: ['read_vehicle_info', 'read_odometer', 'control_security', 'control_security:unlock', 'control_security:lock'],
    testMode: true,
    onComplete: function (err, code) {
      if (err) {
        // handle errors from the authorization flow (i.e. user denies access)
      }
      // handle the returned code by sending it to your back-end server
      $.ajax({
        url: "/callback",
        data: {
          code: code
        },
        success: function (data) {
          window.localStorage.setItem('token', data.accessToken);
          window.localStorage.setItem('clientID', data.id);
          window.location.href = '/vehicle'
        }
      });
    }
  });

  if($('#login_btn').is(':visible')) {
    smartcar.addClickHandler({ id: 'login_btn' });
  };

  $(document).on('click', '#login_btn', function(e) {
    e.preventDefault();
  });

  $(document).on("click", "#lock_btn", function (e) {
    $.ajax({
      type: "POST",
      url: "https://api.smartcar.com/v1.0/vehicles/" + localStorage.getItem('clientID') + "/security",
      headers: { Authorization: "Bearer " + localStorage.getItem('token') },
      data: '{"action": "LOCK"}',
      contentType: 'application/json',
      success: function (data) {
        alert('CAR LOCKED');
      }
    })
  });

  $(document).on("click", "#unlock_btn", function (e) {
    $.ajax({
      type: "POST",
      url: "https://api.smartcar.com/v1.0/vehicles/" + localStorage.getItem('clientID') + "/security",
      headers: { Authorization: "Bearer " + localStorage.getItem('token') },
      data: '{"action": "UNLOCK"}',
      contentType: 'application/json',
      success: function (data) {
        alert('CAR UNLOCKED');
      }
    })
  });

});
