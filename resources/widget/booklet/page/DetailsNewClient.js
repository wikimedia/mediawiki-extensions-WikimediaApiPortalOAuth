( function () {

	/**
	 * @class
	 * @extends mw.apiportal.booklet.page.DetailsReset
	 *
	 * @constructor
	 * @param {string} name - Unique symbolic name of page.
	 * @param {Object} cfg - Config.
	 */
	var DetailsNewClient = function ( name, cfg ) {
		DetailsNewClient.super.call( this, name, cfg );
	};

	OO.inheritClass( DetailsNewClient, mw.apiportal.booklet.page.DetailsReset );

	DetailsNewClient.prototype.setClient = function ( client ) {
		this.client = client;
		this.clientKeyLabel.setLabel( client.get( 'client_key' ) );
	};

	DetailsNewClient.prototype.getLabel = function () {
		return mw.message( 'wikimediaapiportaloauth-ui-new-client-title' ).text();
	};

	DetailsNewClient.prototype.addLayouts = function () {
		var successMessage = new OO.ui.MessageWidget( {
			type: 'success',
			label: mw.message( 'wikimediaapiportaloauth-ui-client-created' ).text()
		} );

		this.content.$element.append( successMessage.$element );

		DetailsNewClient.super.prototype.addLayouts.call( this );
	};

	mw.apiportal.booklet.page.DetailsNewClient = DetailsNewClient;
}() );
