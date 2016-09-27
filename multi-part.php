<?php if ( ! defined( 'ABSPATH' ) ) exit;

/*
 * Plugin Name: Ninja Forms - Multi-Part Forms
 * Plugin URI: https://ninjaforms.com/extensions/multi-part-forms/
 * Description: Multi-Part Forms add-on for Ninja Forms.
 * Version: 3.0.4
 * Author: The WP Ninjas
 * Author URI: http://ninjaforms.com
 * Text Domain: ninja-forms-multi-part
 *
 * Copyright 2014 The WP Ninjas.
 */

if( ! class_exists( 'NF_MultiPart_Conversion', false ) ) {
    require_once 'lib/conversion.php';
}

if( version_compare( get_option( 'ninja_forms_version', '0.0.0' ), '3', '<' ) || get_option( 'ninja_forms_load_deprecated', FALSE ) ) {

    if( ! defined( 'NINJA_FORMS_MP_DIR' ) ) {
        define("NINJA_FORMS_MP_DIR", plugin_dir_path(__FILE__) . '/deprecated');
    }

    if( ! defined( 'NINJA_FORMS_MP_URL' ) ) {
        define("NINJA_FORMS_MP_URL", plugin_dir_url(__FILE__) . '/deprecated');
    }

    if( ! defined( 'NINJA_FORMS_MP_VERSION' ) ) {
        define("NINJA_FORMS_MP_VERSION", "3.0.4");
    }

    include 'deprecated/multi-part.php';

} else {

    if( class_exists( 'NF_MultiPart', false ) ) return;

    /**
     * Class NF_MultiPart
     */
    final class NF_MultiPart
    {
        const VERSION = '3.0.4';
        const SLUG    = 'ninja-forms-multi-part';
        const NAME    = 'Multi Part';
        const AUTHOR  = 'The WP Ninjas';
        const PREFIX  = 'NF_MultiPart';

        public function __construct()
        {
            // Ninja Forms Hooks
            add_action( 'ninja_forms_loaded', array( $this, 'setup_admin' ) );

            add_action( 'admin_init', array( $this, 'setup_license') );
            add_action( 'ninja_forms_builder_templates', array( $this, 'builder_templates' ) );
            add_action( 'ninja_forms_enqueue_scripts', array( $this, 'frontend_templates' ) );
            add_filter( 'ninja_forms_styles_setting_groups', array( $this, 'add_plugin_styles') );
        }

        public function setup_admin()
        {
            if( ! is_admin() ) return;

            new NF_MultiPart_Admin_Settings();
        }

        public function add_plugin_styles( $groups )
        {
            if( ! isset( $groups[ 'form_settings' ] ) || ! isset( $groups[ 'form_settings' ][ 'sections' ] ) ) return $groups;

            $sections = $groups[ 'form_settings' ][ 'sections' ];

            $groups[ 'form_settings' ][ 'sections' ] = array_merge( $sections, array(
                'mp_breadcrumb_container' => array(
                    'name' => 'mp_breadcrumb_container',
                    'type' => 'fieldset',
                    'label' => __( 'Breadcrumb Container Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => '.nf-breadcrumbs',
                ),

                'mp_breadcrumb_buttons' => array(
                    'name' => 'mp_breadcrumb_buttons',
                    'type' => 'fieldset',
                    'label' => __( 'Breadcrumb Buttons Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => '.nf-breadcrumb',
                ),

                'mp_breadcrumb_active' => array(
                    'name' => 'mp_breadcrumb_active',
                    'type' => 'fieldset',
                    'label' => __( 'Breadcrumb Active Button Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => '.active .nf-breadcrumb',
                ),

                'mp_breadcrumb_hover' => array(
                    'name' => 'mp_breadcrumb_hover',
                    'type' => 'fieldset',
                    'label' => __( 'Breadcrumb Button Hover Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => 'nf-breadcrumb:hover',
                ),

                'mp_progress_container' => array(
                    'name' => 'mp_progress_container',
                    'type' => 'fieldset',
                    'label' => __( 'Progress Bar Container Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => '.nf-mp-header progress::-webkit-progress-bar, .nf-mp-header progress::-moz-progress-bar',
                ),

                'mp_progressbar_fill' => array(
                    'name' => 'mp_progressbar_fill',
                    'type' => 'fieldset',
                    'label' => __( 'Progress Bar Fill Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => '.nf-mp-header progress::-webkit-progress-value, .nf-mp-header progress::-moz-progress-value',
                ),

                'mp_page_title' => array(
                    'name' => 'mp_page_title',
                    'type' => 'fieldset',
                    'label' => __( 'Part Titles Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => '.nf-mp-header h3',
                ),

                'mp_prevnext_container' => array(
                    'name' => 'mp_prevnext_container',
                    'type' => 'fieldset',
                    'label' => __( 'Navigation Container Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => '.nf-next-previous',
                ),

                'mp_prev' => array(
                    'name' => 'mp_prev',
                    'type' => 'fieldset',
                    'label' => __( 'Previous Button Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => '.nf-previous',
                ),

                'mp_next' => array(
                    'name' => 'mp_next',
                    'type' => 'fieldset',
                    'label' => __( 'Next Button Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => '.nf-next',
                ),

                'mp_button_hover' => array(
                    'name' => 'navigation_hover_styles',
                    'type' => 'fieldset',
                    'label' => __( 'Navigation Hover Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => '.nf-next-previous input:hover',
                ),

                'mp_page' => array(
                    'name' => 'mp_page',
                    'type' => 'fieldset',
                    'label' => __( 'Form Part Styles', 'ninja-forms-layout-styles' ),
                    'width' => 'full',
                    'selector' => '',
                ),
            ) );

            return $groups;
        }

        public function builder_templates()
        {
            self::template( 'builder.html.php' );
        }

        public function frontend_templates()
        {
            self::template( 'frontend.html.php' );
        }

        /*
        |--------------------------------------------------------------------------
        | Internal API Methods
        |--------------------------------------------------------------------------
        */

        /*
        |--------------------------------------------------------------------------
        | Plugin Properties and Methods
        |--------------------------------------------------------------------------
        */

        /**
         * @var NF_MultiPart
         * @since 3.0
         */
        private static $instance;

        /**
         * Plugin Directory
         *
         * @since 3.0
         * @var string $dir
         */
        public static $dir = '';

        /**
         * Plugin URL
         *
         * @since 3.0
         * @var string $url
         */
        public static $url = '';

        /**
         * Main Plugin Instance
         *
         * Insures that only one instance of a plugin class exists in memory at any one
         * time. Also prevents needing to define globals all over the place.
         *
         * @since 3.0
         * @static
         * @static var array $instance
         * @return NF_MultiPart Highlander Instance
         */
        public static function instance()
        {
            if ( ! isset( self::$instance ) && ! ( self::$instance instanceof NF_MultiPart ) ) {
                self::$instance = new NF_MultiPart();
                self::$dir = plugin_dir_path( __FILE__ );
                self::$url = plugin_dir_url( __FILE__ );
                spl_autoload_register( array( self::$instance, 'autoloader' ) );
            }
            return self::$instance;
        }

        /**
         * Autoloader
         *
         * @param $class_name
         */
        public function autoloader($class_name)
        {
            if( class_exists( $class_name ) ) return;

            if( false === strpos( $class_name, self::PREFIX ) ) return;

            $class_name = str_replace( self::PREFIX, '', $class_name );
            $classes_dir = realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR;
            $class_file = str_replace('_', DIRECTORY_SEPARATOR, $class_name) . '.php';
            
            if ( file_exists( $classes_dir . $class_file ) ) {
                require_once $classes_dir . $class_file;
            }
        }

        /**
         * Template
         *
         * @param string $file_name
         * @param array $data
         */
        public static function template( $file_name = '', array $data = array() )
        {
            if( ! $file_name ) return;

            extract( $data );

            include self::$dir . 'includes/Templates/' . $file_name;
        }

        /**
         * Config
         *
         * @param $file_name
         * @return mixed
         */
        public static function config( $file_name )
        {
            return include self::$dir . 'includes/Config/' . $file_name . '.php';
        }

        /**
         * Setup License
         */
        public function setup_license()
        {
            if ( ! class_exists( 'NF_Extension_Updater' ) ) return;

            new NF_Extension_Updater( 'Multi-Part Forms', self::VERSION, self::AUTHOR, __FILE__, 'mp' );
        }
    }

    /**
     * The main function responsible for returning The Highlander Plugin
     * Instance to functions everywhere.
     *
     * Use this function like you would a global variable, except without needing
     * to declare the global.
     *
     * @since 3.0
     * @return NF_MultiPart Highlander Instance
     */
    function NF_MultiPart()
    {
        return NF_MultiPart::instance();
    }

    NF_MultiPart();

    /*
     * TODO: Move this into the main class.
     */
    function nf_mp_enqueue_all_the_display_things( $form_id ) {
        wp_enqueue_script( 'nf-mp-front-end', NF_MultiPart::$url . 'assets/js/min/front-end.js' );
        
        if( Ninja_Forms()->get_setting( 'opinionated_styles' ) ) {
            if( 'light' == Ninja_Forms()->get_setting( 'opinionated_styles' ) ){
                wp_enqueue_style( 'nf-mp-display', NF_MultiPart::$url . 'assets/css/display-opinions-light.css');
            }

            if( 'dark' == Ninja_Forms()->get_setting( 'opinionated_styles' ) ){
                wp_enqueue_style('nf-mp-display', NF_MultiPart::$url . 'assets/css/display-opinions-dark.css');
            }
        } else {
            wp_enqueue_style( 'nf-mp-display', NF_MultiPart::$url . 'assets/css/display-structure.css' );
        }

    }

    add_action( 'nf_display_enqueue_scripts', 'nf_mp_enqueue_all_the_display_things' );

    function nf_mp_enqueue_all_the_builder_things() {
        wp_enqueue_style( 'nf-mp-builder', plugin_dir_url( __FILE__ ) . 'assets/css/builder.css' );
        wp_enqueue_script( 'nf-mp-builder', plugin_dir_url( __FILE__ ) . 'assets/js/min/builder.js', array( 'nf-builder', 'jquery-effects-slide', 'jquery-effects-transfer' ) );
    }

    add_action( 'nf_admin_enqueue_scripts', 'nf_mp_enqueue_all_the_builder_things' );

}
