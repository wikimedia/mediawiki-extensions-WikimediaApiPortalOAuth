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
		var actionApi;
		Details.super.call( this, name, cfg );

		actionApi = new mw.ForeignApi( mw.apiportal.util.targetApiURL );
		this.restApi = new mw.ForeignRest( mw.apiportal.util.targetRestURL, actionApi );
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
		var deferred = $.Deferred(),
			clientKey = this.client.get( 'client_key' );

		this.restApi.post( '/oauth2/client/' + clientKey + '/reset_secret' )
			.then( function ( response ) {
				deferred.resolve( response );
			} )
			.catch( function ( error, detail ) {
				var xhr = error === 'http' ? detail.xhr : undefined;
				deferred.reject( mw.apiportal.util.getErrorTextFromXHR( xhr ) );
			} );

		return deferred.promise();
	};

	Details.prototype.getAbilities = function () {
		var stage = parseInt( this.client.get( 'stage' ) );
		return stage !== 0 && stage !== 1 ? { reset: false, close: true } : null;
	};

	mw.apiportal.booklet.page.Details = Details;
}() );
