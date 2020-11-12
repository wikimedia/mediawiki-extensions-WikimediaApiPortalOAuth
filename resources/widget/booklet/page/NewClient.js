( function () {

	/**
	 * @class
	 * @extends mw.apiportal.booklet.page.Base
	 *
	 * @constructor
	 * @param {string} name - Unique symbolic name of page.
	 * @param {Object} cfg - Config.
	 */
	var NewClient = function ( name, cfg ) {
		NewClient.super.call( this, name, cfg );
	};

	OO.inheritClass( NewClient, mw.apiportal.booklet.page.Base );

	NewClient.static.grantMapping = {
		read: [ 'basic' ],
		write: [ 'basic', 'createeditmovepage', 'editprotected' ]
	};

	NewClient.prototype.getLabel = function () {
		return mw.message( 'wikimediaapiportaloauth-ui-new-client-title' ).text();
	};

	NewClient.prototype.addLayouts = function () {
		var name,
			layouts = [],
			layoutId;

		this.inputs = {};
		this.inputs.name = new OO.ui.TextInputWidget( {
			required: true
		} );
		this.inputs.description = new OO.ui.MultilineTextInputWidget( {
			required: true,
			rows: 2
		} );

		this.inputs.type = new OO.ui.RadioSelectInputWidget( {
			options: [
				{
					data: 'developer',
					label: mw.message( 'wikimediaapiportaloauth-ui-client-field-account-type-developer' ).text()
				},
				{
					data: 'bot',
					label: mw.message( 'wikimediaapiportaloauth-ui-client-field-account-type-bot' ).text()
				}
			]
		} );

		this.inputs.type.connect( this, {
			change: 'onTypeChange'
		} );

		this.inputs.callbackURI = new OO.ui.TextInputWidget( {
			required: true
		} );

		this.inputs.permissions = new OO.ui.RadioSelectInputWidget( {
			options: [
				{
					data: 'read',
					label: mw.message( 'wikimediaapiportaloauth-ui-client-field-permissions-read' ).text()
				},
				{
					data: 'write',
					label: mw.message( 'wikimediaapiportaloauth-ui-client-field-permissions-read-write' ).text()
				}
			]
		} );

		this.inputs.checks = new OO.ui.CheckboxMultiselectInputWidget( {
			options: [
				{
					data: 'confidential',
					label: new OO.ui.HtmlSnippet( mw.message( 'wikimediaapiportaloauth-ui-client-field-confidential' ).parse() )
				},
				{
					data: 'termsOfService',
					label: new OO.ui.HtmlSnippet( mw.message( 'wikimediaapiportaloauth-ui-client-field-terms-of-service' ).parse() )
				}
			]
		} );

		this.layouts = {
			name: new OO.ui.FieldLayout( this.inputs.name, {
				align: 'top',
				label: mw.message( 'wikimediaapiportaloauth-ui-client-field-name' ).text()
			} ),
			description: new OO.ui.FieldLayout( this.inputs.description, {
				align: 'top',
				label: mw.message( 'wikimediaapiportaloauth-ui-client-field-desc' ).text()
			} ),
			type: new OO.ui.FieldLayout( this.inputs.type, {
				align: 'top',
				label: mw.message( 'wikimediaapiportaloauth-ui-client-field-account-type' ).text()
			} ),
			callbackURI: new OO.ui.FieldLayout( this.inputs.callbackURI, {
				align: 'top',
				label: mw.message( 'wikimediaapiportaloauth-ui-client-field-callback-uri' ).text()
			} ),
			permissions: new OO.ui.FieldLayout( this.inputs.permissions, {
				align: 'top',
				label: mw.message( 'wikimediaapiportaloauth-ui-client-field-permissions' ).text()
			} ),
			checks: new OO.ui.FieldLayout( this.inputs.checks, {
				align: 'top',
				label: mw.message( 'wikimediaapiportaloauth-ui-client-field-checks' ).text()
			} )
		};

		// Reset errors after value change
		for ( name in this.inputs ) {
			if ( !Object.prototype.hasOwnProperty.call( this.inputs, name ) ) {
				continue;
			}
			this.inputs[ name ].connect( this.layouts[ name ], {
				change: function () {
					this.setErrors( [] );
				}
			} );
		}

		// Cannot use Object.values()
		for ( layoutId in this.layouts ) {
			if ( !Object.prototype.hasOwnProperty.call( this.layouts, layoutId ) ) {
				continue;
			}
			layouts.push( this.layouts[ layoutId ] );
		}

		this.content.$element.append( new OO.ui.FieldsetLayout( {
			items: layouts
		} ).$element );
	};

	NewClient.prototype.getInputValidity = function () {
		var toCheck = Object.keys( this.inputs ),
			deferred = $.Deferred();

		this.doCheckValidity( toCheck, deferred );

		return deferred.promise();
	};

	NewClient.prototype.doCheckValidity = function ( inputs, dfd ) {
		var currentKey,
			current;

		if ( inputs.length === 0 ) {
			dfd.resolve();
			return;
		}
		currentKey = inputs.shift();
		current = this.inputs[ currentKey ];

		if ( currentKey === 'checks' ) {
			if ( current.getValue().indexOf( 'termsOfService' ) === -1 ) {
				this.showValidationErrorForLayout( currentKey );
				dfd.reject();
			}
			this.doCheckValidity( inputs, dfd );
		} else if ( typeof current.getValidity === 'function' ) {
			current.getValidity().done( function () {
				this.doCheckValidity( inputs, dfd );
			}.bind( this ) ).fail( function () {
				this.showValidationErrorForLayout( currentKey );
				dfd.reject();
			}.bind( this ) );
		}

		this.doCheckValidity( inputs, dfd );
	};

	NewClient.prototype.createClient = function () {
		var dfd = $.Deferred();

		this.getInputValidity().done( function () {
			$.ajax( {
				url: mw.apiportal.util.targetRestURL + '/oauth2/client',
				data: this.getData(),
				type: 'POST',
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				}
			} ).done( function ( response ) {
				dfd.resolve( response );
			} )
				.fail( function ( jqXHR ) {
					dfd.reject( mw.apiportal.util.getErrorTextFromXHR( jqXHR ) );
				} );
		}.bind( this ) );

		return dfd.promise();
	};

	NewClient.prototype.showValidationErrorForLayout = function ( key ) {
		this.layouts[ key ].setErrors( [ mw.message( 'wikimediaapiportaloauth-ui-error-must-be-set' ).text() ] );
	};

	NewClient.prototype.getGrantTypes = function () {
		// Type "bot" means ownerOnly
		return this.inputs.type.getValue() === 'bot' ?
			[ 'client_credentials' ] :
			[ 'authorization_code', 'refresh_token', 'client_credentials' ];
	};

	NewClient.prototype.getData = function () {
		/* eslint-disable camelcase */
		return {
			name: this.inputs.name.getValue(),
			version: '2.0',
			description: this.inputs.description.getValue(),
			wiki: '*',
			owner_only: this.inputs.type.getValue() === 'bot',
			callback_url: this.inputs.callbackURI.getValue(),
			callback_is_prefix: true,
			email: mw.apiportal.util.userEmail,
			is_confidential: this.inputs.checks.getValue().indexOf( 'confidential' ) !== -1,
			grant_types: this.getGrantTypes().join( '|' ),
			scopes: this.getMappedScopes().join( '|' )
		};
		/* eslint-enable camelcase */
	};

	NewClient.prototype.getMappedScopes = function () {
		var selection = this.inputs.permissions.getValue();
		if ( Object.prototype.hasOwnProperty.call( NewClient.static.grantMapping, selection ) ) {
			return NewClient.static.grantMapping[ selection ];
		}

		return [];
	};

	NewClient.prototype.onTypeChange = function ( value ) {
		if ( value === 'bot' ) {
			this.inputs.callbackURI.setRequired( false );
			this.layouts.callbackURI.setErrors( [] );
		} else {
			this.inputs.callbackURI.setRequired( true );
		}
		this.layouts.callbackURI.toggle();
	};

	mw.apiportal.booklet.page.NewClient = NewClient;
}() );
