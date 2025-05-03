( function () {

	/**
	 * @class
	 * @extends mw.apiportal.booklet.page.Base
	 *
	 * @constructor
	 * @param {string} name - Unique symbolic name of page.
	 * @param {Object} cfg - Config.
	 */
	const Details = function ( name, cfg ) {
		let actionApi;
		Details.super.call( this, name, cfg );

		actionApi = new mw.ForeignApi( mw.apiportal.util.targetApiURL );
		this.restApi = new mw.ForeignRest( mw.apiportal.util.targetRestURL, actionApi );
	};

	OO.inheritClass( Details, mw.apiportal.booklet.page.Base );

	Details.prototype.getLabel = function () {
		return mw.message( 'wikimediaapiportaloauth-ui-client-details-title' ).text();
	};

	Details.prototype.addLayouts = function () {
		const layout = new OO.ui.FieldsetLayout( {
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
				} )
			]
		} );

		if ( !this.client.get( 'owner_only' ) ) {
			layout.addItems( [
				new OO.ui.FieldLayout( new OO.ui.LabelWidget( { label: this.client.get( 'callback_url' ) } ), {
					align: 'top',
					label: this.client.getLabel( 'callback_url' )
				} )
			] );
		}

		this.content.$element.append( layout.$element );
	};

	Details.prototype.resetSecret = function () {
		const deferred = $.Deferred(),
			clientKey = this.client.get( 'client_key' );

		// Not using .post since it only supports JSON, and OAuth REST API is not.
		this.restApi.ajax( '/oauth2/client/' + clientKey + '/reset_secret', {
			type: 'POST',
			data: {},
			contentType: 'application/x-www-form-urlencoded'
		} )
			.then( ( response ) => {
				deferred.resolve( response );
			} )
			.catch( ( error, detail ) => {
				const xhr = error === 'http' ? detail.xhr : undefined;
				deferred.reject( mw.apiportal.util.getErrorTextFromXHR( xhr ) );
			} );

		return deferred.promise();
	};

	Details.prototype.getAbilities = function () {
		const stage = parseInt( this.client.get( 'stage' ) );
		return stage !== 0 && stage !== 1 ? { reset: false, close: true } : null;
	};

	mw.apiportal.booklet.page.Details = Details;
}() );
