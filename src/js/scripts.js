global.jQuery = require('jquery');
popper = require('popper.js');
bootstrap = require('bootstrap');
moustache = require('moustache');

jQuery(document).ready( function($){

  var url = 'https://api.uniteus.io/networks/f022b5dd-e985-44ab-810a-ef0bd8fd7765/groups?access_token=2ZZ4-kHMgYUx8TGDZ_6OFkWC_r66qSwOWxyhCubH'
  var partners = [];

  $.ajax({
      url: url,
      method: 'GET',
      success: function (data) {
          partners.push(data);

          console.log(partners);
      },
      error: function (error) {
          console.log(error);
      }
  });
