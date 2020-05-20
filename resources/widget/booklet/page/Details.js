( function () {

	/**
	 * @class
	 * @extends mw.apiportal.booklet.page.Base
	 *
	 * @constructor
	 * @param {string} name - Unique symbolic name of page.
	 * @param {Object} cfg - Config.
	 */
	var Details = function ( name, cfg ) {
		Details.super.call( this, name, cfg );
	};

	OO.inheritClass( Details, mw.apiportal.booklet.page.Base );

	Details.prototype.getLabel = function () {
		return mw.message( 'wikimediaapiportaloauth-ui-client-details-title' ).text();
	};

	Details.prototype.addLayouts = function () {
		var layout = new OO.ui.FieldsetLayout( {
			items: [
				new OO.ui.FieldLayout( new OO.ui.LabelWidget( { label: this.client.get( 'name' ) } ), {
					align: 'top',
					label: this.client.getLabel( 'name' )
				} ),
				new OO.ui.FieldLayout( new OO.ui.LabelWidget( { label: this.client.get( 'description' ) } ), {
					align: 'top',
					label: this.client.getLabel( 'description' )
				} ),
				new OO.ui.FieldLayout( new OO.ui.LabelWidget( { label: this.client.get( 'client_key' ) } ), {
					align: 'top',
					label: this.client.getLabel( 'client_key' )
				} ),
				new OO.ui.FieldLayout( new OO.ui.LabelWidget( { label: this.client.get( 'callback_url' ) } ), {
					align: 'top',
					label: this.client.getLabel( 'callback_url' )
				} )
			]
		} );

		this.content.$element.append( layout.$element );
	};

	Details.prototype.resetSecret = function () {
		var deferred = $.Deferred();

		$.ajax( {
			url: this.getResetSecretUrl(),
			contentType: 'application/json',
			type: 'POST',
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			}
		} )
			.then( function ( response ) {
				deferred.resolve( response );
			} )
			.catch( function ( jqXHR ) {
				deferred.reject( mw.apiportal.util.getErrorTextFromXHR( jqXHR ) );
			} );

		return deferred.promise();
	};

	Details.prototype.getAbilities = function () {
		var stage = parseInt( this.client.get( 'stage' ) );
		return stage !== 0 && stage !== 1 ? { reset: false, close: true } : null;
	};

	Details.prototype.getResetSecretUrl = function () {
		var clientKey = this.client.get( 'client_key' );
		return mw.apiportal.util.targetRestURL + '/oauth2/client/' + clientKey + '/reset_secret';
	};

	mw.apiportal.booklet.page.Details = Details;
}() );
