<?php

add_action( 'init', 'ninja_forms_register_mp_display_js_css' );
function ninja_forms_register_mp_display_js_css(){
	add_action( 'ninja_forms_display_js', 'ninja_forms_mp_display_js', 10, 2 );
	add_action( 'ninja_forms_display_css', 'ninja_forms_mp_display_css', 10, 2 );
}

function ninja_forms_mp_display_js( $form_id ){
	$form_row = ninja_forms_get_form_by_id( $form_id );
	$form_data = $form_row['data'];
	$pages = ninja_forms_mp_get_pages( $form_id );
	$page_count = count( $pages );
	if( isset( $form_data['ajax'] ) ){
		$ajax = $form_data['ajax'];
	}else{
		$ajax = 0;
	}
	if( isset( $form_data['mp_ajax_effect'] ) ){
		$effect = $form_data['mp_ajax_effect'];
	}else{
		$effect = 'slide';
	}
	if( isset( $form_data['mp_ajax_direction'] ) ){
		$direction = $form_data['mp_ajax_direction'];
	}else{
		$direction = 'ltr';
	}
	if( isset( $form_data['multi_part'] ) AND $form_data['multi_part'] == 1 ){

		wp_enqueue_script( 'ninja-forms-mp-display',
			NINJA_FORMS_MP_URL .'/js/dev/ninja-forms-mp-display.js',
			array( 'jquery', 'ninja-forms-display' ) );

		if( $ajax == 1 ){
			wp_enqueue_script( 'jquery-effects-'.$effect );
		}
		
		wp_localize_script( 'ninja-forms-mp-display', 'ninja_forms_form_'.$form_id.'_mp_settings', array( 'page_count' => $page_count, 'effect' => $effect, 'direction' => $direction ) );
	}
}

function ninja_forms_mp_display_css( $form_id ){
	$form_row = ninja_forms_get_form_by_id( $form_id );
	$form_data = $form_row['data'];
	if( isset( $form_data['multi_part'] ) AND $form_data['multi_part'] == 1 ){
		wp_enqueue_style('ninja-forms-mp-display', NINJA_FORMS_MP_URL .'/css/ninja-forms-mp-display.css');
	}
}