var app = app || {};

$(function( $ ) {
	
	'use strict';

	app.AppView = Backbone.View.extend({

		el: '#todoapp',

		initialize: function() {
			
			alert("initialized view");
		
		}
		
	});

});