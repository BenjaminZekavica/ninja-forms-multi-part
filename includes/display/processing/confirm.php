<?php

/*
 *
 * Function to interrupt the processing of a submission so that a confirmation page can be displayed.
 *
 * @since 1.0.3
 * @returns void
 */

function ninja_forms_mp_add_confirmation_error( $form_id = '' ){
	global $ninja_forms_processing;
	if( $ninja_forms_processing->get_form_setting( 'ajax' ) == 1 ){
		$ajax = 1;
	}else{
		$ajax = 0;
	}
	if ( $form_id == '' ) {
		$form_id = $ninja_forms_processing->get_form_ID();
	}

	if ( !$ninja_forms_processing->get_all_errors() AND $ninja_forms_processing->get_form_setting( 'mp_confirm' ) == 1 AND $ninja_forms_processing->get_action() == 'submit' AND ( !$ninja_forms_processing->get_extra_value( '_mp_confirm' ) OR $ninja_forms_processing->get_extra_value( '_mp_confirm') != 1 ) ) {
		if ( $ajax == 1 ) {
			$error_msg = ninja_forms_mp_output_confirm_page( $form_id );
			$ninja_forms_processing->add_error( 'confirm-submit', '' );
			$ninja_forms_processing->add_error( 'confirm-submit-msg', $error_msg, 'confirm-submit' );	
		} else {
			$ninja_forms_processing->add_error( 'confirm-submit', '' );	
		}
	}
}

add_action( 'ninja_forms_pre_process', 'ninja_forms_mp_add_confirmation_error', 999 );