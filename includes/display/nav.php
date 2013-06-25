<?php

add_action( 'ninja_forms_display_after_fields', 'ninja_forms_mp_nav' );
function ninja_forms_mp_nav( $form_id ){
	global $ninja_forms_processing;
	$form_row = ninja_forms_get_form_by_id( $form_id );
	$form_data = $form_row['data'];
	$all_fields = ninja_forms_get_fields_by_form_id( $form_id );

	if( isset( $form_data['multi_part'] ) ){
		$multi_part = $form_data['multi_part'];
	}else{
		$multi_part = 0;
	}

	if( isset( $form_data['ajax'] ) ){
		$ajax = 1;
	}else{
		$ajax = 0;
	}

	if( $multi_part == 1 ){

		if( isset( $_REQUEST['_current_page'] ) ){
			$current_page = $_REQUEST['_current_page'];
		}else{
			$current_page = 1;
		}

		if( is_object( $ninja_forms_processing ) AND $ninja_forms_processing->get_extra_value( '_current_page' ) AND $form_id == $ninja_forms_processing->get_form_ID() ){
			$current_page = $ninja_forms_processing->get_extra_value( '_current_page' );
		}

		if( is_object( $ninja_forms_processing ) AND $ninja_forms_processing->get_form_setting( 'sub_id' ) ){
			$sub_id = $ninja_forms_processing->get_form_setting( 'sub_id' );
		}else{
			$sub_id = '';
		}

		$pages = array();

		if( is_array( $all_fields ) AND !empty( $all_fields ) ){

			$this_page = array();
			$x = 0;
			foreach( $all_fields as $field ){
				if( $field['type'] == '_page_divider' ){
					$x++;
				}
				$pages[$x][] = $field['id'];
			}
		}

		$page_count = count($pages);
		$x = 2;
		$show_next = false;
		while( $x <= $page_count ){
			if( ninja_forms_mp_check_page_conditional( $form_id, $x ) ){
				$show_next = true;
				break;
			}
			$x++;
		}

		?>
		<input type="hidden" name="_sub_id" value="<?php echo $sub_id;?>">
		<input type="hidden" name="_current_page" value="<?php echo $current_page;?>">
		<div id="ninja_forms_mp_nav_wrap" class="ninja-forms-mp-nav-wrap">
			<?php
			if( $ajax == 1 ){
				if( $current_page == 1 AND $current_page < $page_count ){
					$prev_style = 'display:none;';
					$next_style = '';
					if( !$show_next ){
						$next_style = 'display:none;';
					}
				}else if( $current_page > 1 AND $current_page < $page_count ){
					$prev_style = '';
					$next_style = '';
				}else if( $current_page == $page_count ){
					$prev_style = '';
					$next_style = 'display:none;';
				}
				?>
				<input type="submit" name="_prev" class="ninja-forms-mp-nav ninja-forms-mp-prev" id="ninja_forms_form_<?php echo $form_id;?>_mp_prev" value="<?php _e( 'Previous', 'ninja-forms' );?>" style="<?php echo $prev_style;?>">
				<input type="submit" name="_next" class="ninja-forms-mp-nav ninja-forms-mp-next" id="ninja_forms_form_<?php echo $form_id;?>_mp_next" value="<?php _e( 'Next', 'ninja-forms' );?>" style="<?php echo $next_style;?>">	
				<?php
			}else{
				if( $current_page != 1 AND $next_style ){
					?>
					<input type="submit" name="_prev" class="ninja-forms-mp-nav ninja-forms-mp-prev" id="ninja_forms_form_<?php echo $form_id;?>_mp_prev" value="<?php _e( 'Previous', 'ninja-forms' );?>">
					<?php
				}
				if( $current_page < $page_count ){
					?>
					<input type="submit" name="_next" class="ninja-forms-mp-nav ninja-forms-mp-next" id="ninja_forms_form_<?php echo $form_id;?>_mp_next" value="<?php _e( 'Next', 'ninja-forms' );?>">
					<?php
				}				
			}
			?>
		</div>
		<?php
	}
}