var app = app || {};

$(function( $ ) {
	
	'use strict';
	
	app.HeaderView = Backbone.View.extend({
		
		el: '#headerContainer',
		
		textContent: undefined,
		
		initialize: function() {
			this.setText("Initialized.");
		},
		
		setText: function(text) {
			this.textContent = text;
			this.render();
		},
		
		render: function(){
            
			//var template = _.template( $("#search_template").html(), {} );
            
			this.$el.html( this.textContent );
        
		}
		
	});
	

});