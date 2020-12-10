( function () {

	/**
	 * @constructor
	 * @param {Object} cfg - Config.
	 * @param {Object} cfg.$element - JQuery selector (API management panel).
	 * @param {number} cfg.pageLimit - Page limit number.
	 */
	var KeyOverview = function ( cfg ) {
		var actionApi = new mw.ForeignApi( mw.apiportal.util.targetApiURL );

		this.$element = cfg.$element;
		this.pageLimit = cfg.pageLimit;
		this.offset = 0;
		this.restApi = new mw.ForeignRest( mw.apiportal.util.targetRestURL, actionApi );

		this.newClientButton = new OO.ui.ButtonWidget( {
			label: mw.message( 'wikimediaapiportaloauth-ui-action-new-client' ).text(),
			flags: [ 'primary', 'progressive' ]
		} );
		this.newClientButton.connect( this, {
			click: 'makeNewClient'
		} );

		this.$itemContainer = $( '<div>' );
		this.$element.append( this.$itemContainer, this.newClientButton.$element );

		this.showLoading( true );
		this.loadClients( {}, true );
	};

	OO.initClass( KeyOverview );

	KeyOverview.prototype.showLoading = function ( show ) {
		if ( !show && this.loader ) {
			this.loader.$element.remove();
		}
		if ( show ) {
			this.loader = new OO.ui.ProgressBarWidget( { classes: [ 'apiportal-oauth-loader' ] } );
			this.$element.prepend( this.loader.$element );
		}
	};

	KeyOverview.prototype.loadClients = function ( data, initial ) {
		data = data || {};
		data = $.extend( {
			limit: this.pageLimit,
			/* eslint-disable camelcase */
			oauth_version: '2',
			/* eslint-enable camelcase */
			sort: JSON.stringify( { property: 'registration', direction: 'DESC' } )
		}, data );

		this.restApi.get( '/oauth2/client', data )
			.then(
				function ( response ) {
					this.showLoading( false );
					if ( Object.prototype.hasOwnProperty.call( response, 'clients' ) ) {
						this.buildList( response.clients );
					}
					if ( initial && Object.prototype.hasOwnProperty.call( response, 'total' ) ) {
						if ( response.total > this.pageLimit ) {
							this.buildPagination( response.total );
						}
					}
				}.bind( this ),
				function ( error, detail ) {
					var xhr = error === 'http' ? detail.xhr : undefined;
					this.showLoading( false );
					this.processError( mw.apiportal.util.getErrorTextFromXHR( xhr ) );
				}.bind( this )
			);
	};

	KeyOverview.prototype.buildList = function ( clients ) {
		var clientEntity, i;
		this.$itemContainer.children().remove();
		for ( i = 0; i < clients.length; i++ ) {
			clientEntity = new mw.apiportal.ClientEntity( clients[ i ] );
			this.$itemContainer.append( new mw.apiportal.widget.Client( clientEntity ).$element );
		}
	};

	KeyOverview.prototype.processError = function ( message ) {
		if ( this.error ) {
			this.error.$element.remove();
		}
		this.error = new OO.ui.MessageWidget( {
			type: 'error',
			label: message
		} );
	};

	KeyOverview.prototype.buildPagination = function ( total ) {
		var pages = Math.ceil( total / this.pageLimit ),
			$pagination = $( '<nav>' ),
			$paginationInner = $( '<ul>' ).addClass( 'pagination justify-content-center' ),
			i,
			$anchor;

		for ( i = 0; i < pages; i++ ) {
			$anchor = $( '<a>' )
				.addClass( 'page-link' )
				.attr( 'href', '#' )
				.attr( 'data-offset', i * this.pageLimit )
				.html( i + 1 );
			$anchor.on( 'click', function ( e ) {
				var $target,
					data;

				e.preventDefault();
				e.stopPropagation();
				$target = $( e.target );
				data = $target.data();

				if ( !Object.prototype.hasOwnProperty.call( data, 'offset' ) ) {
					return;
				}
				this.loadClients( { offset: data.offset } );
				$paginationInner.children( '.page-item' ).removeClass( 'active' );
				$target.parent( 'li' ).addClass( 'active' );
			}.bind( this ) );
			$paginationInner.append(
				// The following classes are used here:
				// * page-item
				// * page-item active
				$( '<li>' )
					.addClass( 'page-item ' + ( i === 0 ? 'active' : '' ) )
					.append( $anchor )
			);
		}

		$pagination.append( $paginationInner );
		this.$element.append( $pagination );
	};

	KeyOverview.prototype.makeNewClient = function () {
		var windowManager = OO.ui.getWindowManager(),
			instance;

		this.dialog = new mw.apiportal.dialog.Client( {
			size: 'large',
			booklet: new mw.apiportal.booklet.NewClient()
		} );
		windowManager.addWindows( [ this.dialog ] );
		instance = windowManager.openWindow( this.dialog );
		instance.closed.then(
			function ( result ) {
				if ( result && Object.prototype.hasOwnProperty.call( result, 'update' ) && result.update ) {
					this.loadClients();
				}
			}.bind( this )
		);
	};

	mw.apiportal.widget.KeyOverview = KeyOverview;
}() );
