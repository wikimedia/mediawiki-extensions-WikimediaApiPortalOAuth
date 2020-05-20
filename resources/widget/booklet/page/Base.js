( function () {

	/**
	 * @class
	 * @extends OO.ui.PageLayout
	 *
	 * @constructor
	 * @param {string} name - Unique symbolic name of page.
	 * @param {Object} cfg - Config.
	 * @param {Object} cfg.client - Client.
	 */
	var Base = function ( name, cfg ) {
		Base.super.call( this, name, cfg );

		this.client = cfg.client;

		this.build();
	};

	OO.inheritClass( Base, OO.ui.PageLayout );

	Base.prototype.build = function () {
		this.content = new OO.ui.PanelLayout( {
			padded: false,
			expanded: false,
			classes: [ 'client-details-panel' ]
		} );
		this.addLayouts();

		this.$element.append( this.content.$element );
	};

	Base.prototype.addLayouts = function () {
		// STUB
	};

	Base.prototype.getLabel = function () {
		return '';
	};

	Base.prototype.getAbilities = function () {
		// Return null for no limitations
		return null;
	};

	mw.apiportal.booklet.page.Base = Base;
}() );
