( function () {

	/**
	 * @class
	 * @extends OO.ui.ProcessDialog
	 *
	 * @constructor
	 * @param {Object} cfg - Config.
	 * @param {Object} cfg.client - Client.
	 * @param {Object} cfg.booklet - Booklet.
	 */
	var Client = function ( cfg ) {
		Client.super.call( this, cfg );

		this.client = cfg.client || null;
		this.booklet = cfg.booklet;
		this.updateFlag = false;
		this.$errorArea = $( '<div>' );
		this.booklet.connect( this, {
			set: 'onPageSet'
		} );
	};

	OO.inheritClass( Client, OO.ui.ProcessDialog );

	Client.static.name = 'client_dialog';
	Client.static.title = '';
	Client.static.actions = [
		{
			action: 'close', label: mw.message( 'wikimediaapiportaloauth-ui-action-done' ).text(),
			flags: [ 'primary' ],
			modes: [ 'details', 'details_reset', 'details_new' ]
		},
		{
			action: 'reset', label: mw.message( 'wikimediaapiportaloauth-ui-action-reset-secret' ).text(),
			flags: [ 'progressive' ],
			modes: 'details'
		},
		{
			action: 'create', label: mw.message( 'wikimediaapiportaloauth-ui-action-create' ).text(),
			flags: [ 'primary', 'progressive' ],
			modes: [ 'new' ]
		},
		{
			label: mw.message( 'wikimediaapiportaloauth-ui-action-cancel' ).text(),
			flags: 'safe',
			modes: [ 'new' ]
		}
	];

	Client.prototype.getSetupProcess = function ( data ) {
		data.title = this.booklet.getCurrentPage().getLabel();
		return Client.super.prototype.getSetupProcess.call( this, data )
			.next(
				function () {
					this.actions.setMode( this.booklet.getCurrentPageName() );
					this.onPageSet( this.booklet.getCurrentPage() );
				}.bind( this )
			);
	};

	Client.prototype.setErrors = function ( errors ) {
		var i;

		this.clearErrors();
		if ( !Array.isArray( errors ) ) {
			errors = [ errors ];
		}
		for ( i = 0; i < errors.length; i++ ) {
			this.errors.push( new OO.ui.MessageWidget( {
				type: 'error',
				label: errors[ i ]
			} ) );
		}
		this.renderErrors();
	};

	Client.prototype.clearErrors = function () {
		this.$errorArea.empty();
		this.errors = [];
	};

	Client.prototype.renderErrors = function () {
		var i;

		for ( i = 0; i < this.errors.length; i++ ) {
			this.$errorArea.append( this.errors[ i ].$element );
		}
		this.updateSize();
	};

	Client.prototype.onPageSet = function ( page ) {
		var abilities = page.getAbilities();
		this.clearErrors();

		if ( !( page instanceof mw.apiportal.booklet.page.Base ) ) {
			return;
		}
		if ( abilities !== null ) {
			this.actions.setAbilities( abilities );
		}

		this.title.setLabel( page.getLabel() );
	};

	Client.prototype.initialize = function () {
		Client.super.prototype.initialize.call( this );
		this.$body.prepend( this.$errorArea );
		this.$body.append( this.booklet.$element );
	};

	Client.prototype.getBodyHeight = function () {
		return this.$body.outerHeight( true );
	};

	Client.prototype.getActionProcess = function ( action ) {
		if ( action === 'close' ) {
			return new OO.ui.Process( function () {
				this.close( { update: this.updateFlag } );
			}.bind( this ) );
		}

		if ( action === 'reset' ) {
			return new OO.ui.Process( function () {
				this.booklet.getPage( 'details' ).resetSecret()
					.done( function ( data ) {
						this.booklet.setPage( 'details_reset' );
						this.booklet.getPage( 'details_reset' ).setAuthenticationData( data );
						this.actions.setMode( 'details_reset' );
					}.bind( this ) )
					.fail( function ( error ) {
						this.setErrors( error );
					}.bind( this ) );
			}.bind( this ) );
		}

		if ( action === 'create' ) {
			return new OO.ui.Process( function () {
				this.booklet.getPage( 'new' ).createClient()
					.done( function ( response ) {
						this.booklet.setPage( 'details_new' );
						this.booklet.getPage( 'details_new' ).setClient( new mw.apiportal.ClientEntity( response ) );
						this.booklet.getPage( 'details_new' ).setAuthenticationData( response );
						this.updateFlag = true;
						this.actions.setMode( 'details_new' );
					}.bind( this ) )
					.fail( function ( error ) {
						this.setErrors( error );
					}.bind( this ) );
			}.bind( this ) );
		}

		return Client.super.prototype.getActionProcess.call( this, action );
	};

	mw.apiportal.dialog.Client = Client;
}() );
