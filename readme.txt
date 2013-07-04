=== Ninja Forms - Multi-Part Forms Extension ===
Contributors: kstover, jameslaws
Donate link: http://wpninjas.com
Tags: form, forms
Requires at least: 3.3
Tested up to: 3.5
Stable tag: 1.0.4

License: GPLv2 or later

== Description ==
The Ninja Forms Multi-Part Extension allows you to break forms up into multiple pages. This can be very helpful for long or complex forms.

== Screenshots ==

To see up to date screenshots, visit the [Ninja Forms](http://wpninjas.com/ninja-forms/) page.

== Installation ==

This section describes how to install the plugin and get it working.

1. Upload the `ninja-forms` directory to your `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Visit the 'Forms' menu item in your admin sidebar
4. On the form settings page, you will now have options for multi-part forms.

== Use ==

For help and video tutorials, please visit our website: [Ninja Forms Documentation](http://wpninjas.com/ninja-forms/docs/)

== Changelog ==

= 1.0.5 =

*Bugs:*

* Fixed a php warning caused by a function running even if Multi-Part forms weren't enabled.
* Fixed a bug that was causing breadcrumb navigation to have the incorrect classes applied.

= 1.0.4 =

*Bugs:*

* Fixed a bug that caused the new, shorter field length to show incorrectly when the settings were saved.

= 1.0.3 =

*Features:*

* Multi-Part Forms will now allow you to hide or show an entire page when used in conjunction with the Conditionals extension.
* A new "Confirmation Page" option has been added. If this is selected, the user will be presented with a page showing all of their entered data, separated by page.

*Changes:*

* Changed the way that MP forms CSS is laid out to make it compatiable with version 2.2.18 of Ninja Forms.

= 1.0.2 =

*Bugs:*

* Fixed a bug with Multi-Part Forms and AJAX submissions that might affect some users.

= 1.0.1 =

*Features:*

* Updated Multi-Part Forms so that the extension works with AJAX submissions.

*Changes:*

* The ID of the DIV that wraps the navigation elements has been changed to ninja_forms_mp_nav_wrap from ninja-forms-mp-nav-wrap.
* A class of 'ninja-forms-mp-nav-wrap' has been placed on the DIV that wraps the navigation elements.

= 1.0 =

*Bugs:*

* Fixed a bug that prevented multi-part from working properly with post creation.

= 0.9 =

*Bugs:*

* Fixed a bug that prevented two multi-part forms from working properly on the same page.

= 0.8 =

* Field values that are emailed should now appear in the proper order.

= 0.7 =

*Changes:*

* Added a prev/next wrapper, adjust default styling for breadcrumbs and progress-bar.

= 0.6 =
* Fixed a bug that prevented the Multi-Part extension from interacted properly with the Save Progress extension.

= 0.5 =
* Fixed a bug that was preventing required fields from being properly checked.
* Fixed a bug with breadcrumb navigation that prevented the page with the first error from reloading if a user skipped to the end of a form and submitted.
* Fixed a bug that was preventing a form from properly being changed into a Multi-Part form.

= 0.4 =
* Fixed a bug that caused design elements, especially text fields, from showing on multi-part forms.

= 0.3 =
* Various bug fixes including:
* A bug which prevented all fields from being emailed to the administrator.

= 0.2 =
* Various bug fixes.
* Changed the way that javascript and css files are loaded in extensions.