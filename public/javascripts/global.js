const smartcar = new Smartcar({
    clientId: 'a0a02014-6562-4f13-8e1b-9fcdc23711f3',
    redirectUri: 'https://javascript-sdk.smartcar.com/redirect-2.0.0?app_origin=http://localhost:3000',
    scope: ['read_vehicle_info', 'read_odometer', 'control_security', 'control_security:unlock', 'control_security:lock'],
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
            success: function(data) {
                debugger
                let token = data.accessToken;
                let id = data.id;

                $.ajax({
                    type: "POST",
                    url: "https://api.smartcar.com/v1.0/vehicles/" + id + "/security",
                    headers: { Authorization: "Bearer " + token},
                    data: '{"action": "LOCK"}',
                    contentType: 'application/json',
                    success: function(data) {
                        debugger;
                    }
                })
            }
          });
    }
});

smartcar.addClickHandler({id: 'connect_car'});