exports.index = (req, res) => {
    // TODO: Request Step 2: Get vehicle information
    return smartcar.getVehicleIds(access.accessToken)
      .then(function(data) {
        // the list of vehicle ids
        return data.vehicles;
      })
      .then(function(vehicleIds) {
        // instantiate the first vehicle in the vehicle id list
        const vehicle = new smartcar.Vehicle(vehicleIds[0], access.accessToken);
  
        return vehicle.info();
      })
      .then(function(info) {
        res.render('vehicle', {
          info: info,
        });
      });
  };
  