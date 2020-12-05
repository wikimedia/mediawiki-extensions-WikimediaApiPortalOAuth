<?php

namespace MediaWiki\Extension\WikimediaApiPortalOAuth\Special;

use Html;
use SpecialPage;

/**
 * Class AppManagement
 * @package MediaWiki\Extension\WikimediaApiPortalOAuth\Special
 */
class AppManagement extends SpecialPage {

	/**
	 * AppManagement constructor.
	 */
	public function __construct() {
		parent::__construct( 'AppManagement', 'wikimediaapiportaloauth-manage-oauth' );
	}

	/**
	 * @inheritDoc
	 */
	public function isIncludable() {
		return true;
	}

	/**
	 * @inheritDoc
	 */
	public function execute( $subPage ) {
		parent::execute( $subPage );

		$output = $this->getOutput();
		$output->disallowUserJs();

		if ( !$this->getUser()->isEmailConfirmed() ) {
			$output->addHTML(
				$this->msg( 'wikimediaapiportaloauth-email-not-confirmed' )
			);
			return;
		}

		$output->addHTML(
			$this->msg( 'wikimediaapiportaloauth-page-introduction' )
		);

		$output->addModules(
			'ext.wikimediaapiportaloauth.keyManagement'
		);
		$output->addHTML( Html::element( 'div', [
			'id' => 'api-management-panel'
		] ) );
		$output->addJsConfigVars( [
			'wgWikimediaApiPortalOAuthMetaRestURL' => $this->getConfig()->get( 'WikimediaApiPortalOAuthMetaRestURL' ),
			'wgWikimediaApiPortalOAuthMetaApiURL' => $this->getConfig()->get( 'WikimediaApiPortalOAuthMetaApiURL' ),
			'wgWikimediaApiPortalUserEmail' => $this->getUser()->getEmail()
		] );
	}
}
