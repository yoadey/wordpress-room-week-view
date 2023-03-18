<?php
/**
 * Plugin Name:       Room Week View
 * Description:       Displays the occupancy of multiple rooms side by side
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       room-week-view
 *
 * @package           room-week-view
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function room_week_view_room_week_view_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'room_week_view_room_week_view_block_init' );

function room_week_view_frontend_scripts() {
	if ( has_block( 'room-week-view/room-week-view' ) ) {
		wp_enqueue_script(
			'room_week_view',
        		plugins_url( 'dist/room_week_view.js', __FILE__ ),
			array( 'jquery' ),
			filemtime( plugin_dir_path( __FILE__ ) . 'dist/room_week_view.js' )
		);
	}
}
add_action( 'wp_enqueue_scripts', 'room_week_view_frontend_scripts' );
