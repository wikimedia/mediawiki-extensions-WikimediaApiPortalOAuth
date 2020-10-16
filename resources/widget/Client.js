( function () {

	/**
	 * @class
	 * @extends OO.ui.Widget
	 *
	 * @constructor
	 * @param {Object} client - Client.
	 */
	var Client = function ( client ) {
		mw.apiportal.widget.Client.super.call( this, {} );

		this.client = client;

		this.$dataContainer = $( '<div>' ).addClass( 'data-container' );
		this.$actionContainer = $( '<div>' ).addClass( 'action-container' );

		this.createData();
		this.createActions();

		this.$element.append( this.$dataContainer, this.$actionContainer );
		this.$element.addClass( 'apiportal-key-overview-item' );
	};

	OO.inheritClass( Client, OO.ui.Widget );

	Client.static.statuses = {
		0: {
			label: 'wikimediaapiportaloauth-ui-client-status-proposed',
			help: 'wikimediaapiportaloauth-ui-client-status-proposed-help'
		},
		1: {
			label: 'wikimediaapiportaloauth-ui-client-status-approved'
		},
		2: {
			label: 'wikimediaapiportaloauth-ui-client-status-rejected'
		},
		3: {
			label: 'wikimediaapiportaloauth-ui-client-status-expired'
		},
		4: {
			label: 'wikimediaapiportaloauth-ui-client-status-disabled'
		}
	};

	Client.prototype.createData = function () {
		this.$dataContainer.append(
			new OO.ui.LabelWidget( {
				label: this.client.get( 'name' ),
				classes: [ 'data-name' ]
			} ).$element,
			new OO.ui.HorizontalLayout( {
				items: [
					new OO.ui.LabelWidget( {
						label: mw.message(
							'wikimediaapiportaloauth-ui-registration-label',
							this.client.get( 'registration_formatted' )
						).text(),
						classes: [ 'registration-time-label' ]
					} ),
					this.makeStatusMessage()
				]
			} ).$element
		);
	};

	Client.prototype.createActions = function () {
		var detailsButton = new OO.ui.ButtonWidget( {
				label: mw.message( 'wikimediaapiportaloauth-ui-client-action-view-details' ).text(),
				framed: false,
				classes: [ 'actions-details' ]
			} ),
			disableButton = new OO.ui.ButtonWidget( {
				label: mw.message( 'wikimediaapiportaloauth-ui-client-action-disable' ).text(),
				framed: false
			} );

		detailsButton.connect( this, {
			click: 'showDetails'
		} );
		disableButton.connect( this, {
			click: 'disableClient'
		} );

		this.$actionContainer.append( detailsButton.$element );
		// To be enabled in the future
		// this.$actionContainer.append( disableButton.$element );
	};

	Client.prototype.makeStatusMessage = function () {
		var clientStatus = parseInt( this.client.get( 'stage' ) ),
			status,
			label,
			layout = new OO.ui.HorizontalLayout( { classes: [ 'client-status' ] } );
		if ( !Object.prototype.hasOwnProperty.call( Client.static.statuses, clientStatus ) ) {
			return null;
		}
		status = Client.static.statuses[ clientStatus ];
		// Messages that can be used here:
		// * wikimediaapiportaloauth-ui-client-status-proposed
		// * wikimediaapiportaloauth-ui-client-status-approved
		// * wikimediaapiportaloauth-ui-client-status-rejected
		// * wikimediaapiportaloauth-ui-client-status-expired
		// * wikimediaapiportaloauth-ui-client-status-disabled
		label = mw.message( status.label ).text();
		label = mw.message(
			'wikimediaapiportaloauth-ui-client-status-wrapper',
			label
		).text();

		if ( Object.prototype.hasOwnProperty.call( status, 'icon' ) ) {
			layout.addItems( [
				new OO.ui.IconWidget( { icon: status.icon } )
			] );
		}
		layout.addItems( [
			new OO.ui.LabelWidget( {
				label: label
			} )
		] );

		if ( Object.prototype.hasOwnProperty.call( status, 'help' ) ) {
			layout.addItems( [ new OO.ui.PopupButtonWidget( {
				icon: 'info',
				framed: false,
				invisibleLabel: true,
				popup: {
					// Message that can be used here:
					// * wikimediaapiportaloauth-ui-client-status-proposed-help
					// eslint-disable-next-line mediawiki/msg-doc
					$content: $( '<span>' ).text( mw.message( status.help ).text() ),
					padded: true,
					align: 'forwards'
				}
			} ) ] );
		}

		return layout;
	};

	Client.prototype.showDetails = function () {
		var windowManager = OO.ui.getWindowManager();
		this.dialog = new mw.apiportal.dialog.Client( {
			size: 'medium',
			client: this.client,
			booklet: new mw.apiportal.booklet.Details( { client: this.client } )
		} );
		windowManager.addWindows( [ this.dialog ] );
		windowManager.openWindow( this.dialog );
	};

	Client.prototype.disableClient = function () {
	};

	mw.apiportal.widget.Client = Client;
}() );
