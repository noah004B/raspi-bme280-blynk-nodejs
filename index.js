const BME280 = require('bme280-sensor');
const Blynk = require('blynk-library');
const Settings = require('./settings.json')

// Blynk options
//
const blynkAuth = Settings.blynk.auth;
const blynkOptions = Settings.blynk.options;
const blynk = new Blynk.Blynk(blynkAuth, blynkOptions);

// The BME280 constructor options are optional.
// 
const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : 0x76 // defaults to 0x77
};

const bme280 = new BME280(options);

// Read BME280 sensor data, repeat
//
const readSensorData = () => {
  bme280.readSensorData()
    .then((data) => {
      blynk.virtualWrite(5, data.temperature_C);
      blynk.virtualWrite(6, Math.round(data.humidity * 100) / 100);
      blynk.virtualWrite(7, data.pressure_hPa);
      console.log(`data = ${JSON.stringify(data, null, 2)}`);
      setTimeout(readSensorData, 2000);
    })
    .catch((err) => {
      console.log(`BME280 read error: ${err}`);
      setTimeout(readSensorData, 2000);
    });
};

// Initialize the BME280 sensor
//
bme280.init()
  .then(() => {
    console.log('BME280 initialization succeeded');
    readSensorData();
  })
  .catch((err) => console.error(`BME280 initialization failed: ${err} `));

