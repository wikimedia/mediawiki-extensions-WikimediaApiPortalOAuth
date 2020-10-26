( function () {

	/**
	 * @class
	 * @extends mw.apiportal.booklet.page.Base
	 *
	 * @constructor
	 * @param {string} name - Unique symbolic name of page.
	 * @param {Object} cfg - Config.
	 */
	var DetailsReset = function ( name, cfg ) {
		DetailsReset.super.call( this, name, cfg );
	};

	OO.inheritClass( DetailsReset, mw.apiportal.booklet.page.Base );

	DetailsReset.prototype.setAuthenticationData = function ( data ) {
		if ( Object.prototype.hasOwnProperty.call( data, 'secret' ) ) {
			this.secretLabel.setLabel( data.secret );
		}
		if ( Object.prototype.hasOwnProperty.call( data, 'access_token' ) ) {
			this.accessTokenLabel.setLabel( data.access_token );
		} else {
			this.accessTokenLayout.$element.hide();
		}
	};

	DetailsReset.prototype.getLabel = function () {
		return mw.message( 'wikimediaapiportaloauth-ui-client-details-reset-title' ).text();
	};

	DetailsReset.prototype.addLayouts = function () {
		var layout, alert;

		this.secretLabel = new OO.ui.LabelWidget();
		this.accessTokenLabel = new OO.ui.LabelWidget( {
			classes: [ 'access-token-label' ]
		} );
		this.accessTokenLayout = new OO.ui.FieldLayout( this.accessTokenLabel, {
			align: 'top',
			label: mw.message( 'wikimediaapiportaloauth-ui-field-access-token' ).text()
		} );
		this.clientKeyLabel = new OO.ui.LabelWidget( {
			label: this.client.get( 'client_key' )
		} );

		layout = new OO.ui.FieldsetLayout( {
			items: [
				new OO.ui.FieldLayout( this.clientKeyLabel, {
					align: 'top',
					label: this.client.getLabel( 'client_key' )
				} ),
				new OO.ui.FieldLayout( this.secretLabel, {
					align: 'top',
					label: mw.message( 'wikimediaapiportaloauth-ui-field-secret' ).text()
				} ),
				this.accessTokenLayout
			]
		} );

		alert = new OO.ui.MessageWidget( {
			type: 'warning',
			label: mw.message( 'wikimediaapiportaloauth-ui-client-secret-alert' ).text()
		} );

		this.content.$element.append( layout.$element, alert.$element );
	};

	mw.apiportal.booklet.page.DetailsReset = DetailsReset;
}() );
