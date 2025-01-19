<?php

/**
 * Plugin Name:       Rw Blocks
 * Description:       A set of customizable blocks for slideshow & svg handling.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.3
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       rw-blocks
 *
 * @package CreateBlock
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}
$CAT = "rw-blocks";
$BLOCKS = array('world-map', 'slideshow'/* , 'slide' */);
$RW_BLOCKS = array();
$Themes = array();

function register_block_category($categories) {
	global $CAT;
	return array_merge(
		$categories,
		array(
			array(
				'slug' => $CAT,
				'title' => __('rw Blocks', $CAT),
				//'icon'  => 'wordpress', // This is optional
			),
		)
	);
}
//* Add a cat.
add_filter('block_categories_all', 'register_block_category');

function load_php_config($blockName) {
	$file_path = plugin_dir_path(__FILE__) . "build/{$blockName}/config.php";
	if (file_exists($file_path)) {
		return include $file_path;
	}
	return null;
}
//* Init
function rw_blocks_init() {
	global $CAT, $BLOCKS, $RW_BLOCKS;

	foreach ($BLOCKS as $folder) {
		$block = register_block_type(__DIR__ . '/build/' . $folder, array('category' => $CAT));
		if ($block) {
			$name = $block->name;
			$conf = load_php_config($folder);
			if ($conf) {
				$RW_BLOCKS[$name] = $conf;
				if (isset($conf['themes'])) {
					$RW_BLOCKS[$name]['theme'] = array();
					foreach ($conf['themes'] as $ar) {
						$th = $ar["pt"];
						$nm = pathinfo($th, PATHINFO_FILENAME);
						$pt = plugins_url("build/{$folder}/{$th}", __FILE__);
						//---------------
						$min_nm = str_replace(".css", "-min.css", $th);
						$min_pt = plugin_dir_path(__FILE__) . "build/{$folder}/" . $min_nm;
						//---------------
						$content = is_admin() ? $pt : file_get_contents($min_pt);
						$RW_BLOCKS[$name]['theme'][$nm] = array('path' => $pt, 'content' => $content);
					}
				}
			}
		}
	}
}
add_action('init', 'rw_blocks_init');
//=====
//* block based themes css inline logic see block's logic for block-editor css logic
function collect_themes($content, $block) {
	global $RW_BLOCKS, $Themes;
	//$themes = get_option('themes', array());
	if (isset($RW_BLOCKS[$block['blockName']]) && isset($block['attrs']['theme'])) {
		error_log($block['content']);
		$name = $block['blockName'];
		$theme = $block['attrs']['theme'];
		if (!isset($Themes[$name][$theme])) {
			$Themes[$name][$theme] = $RW_BLOCKS[$name]['theme'][$theme];
		}
	}
	//update_option('themes', $themes);
	return $content;
}
add_filter('render_block', 'collect_themes', 10, 2);

function append_styles() {
	global $Themes;
	if (is_admin()) {
		foreach ($Themes as $name => $block) {
			foreach ($block as $theme => $info) {
				$el = '<link rel="stylesheet" id="' . esc_attr($name) . esc_attr($theme) . '" href="' . esc_url($info['path']) . '" />';
				error_log($el);
				echo $el;
			}
		}
		return;
	}
	$css = '';
	foreach ($Themes as $name => $block) {
		foreach ($block as $theme => $info) {
			$css .= $info['content'];
		}
	}
	if (!empty($css)) {
		echo '<style rwb>' . $css . '</style>';
	}
	delete_option('themes'); // Clean up after processing
}
add_action('wp_head', 'append_styles');
//=========
// load coreWeb-js
if (!function_exists('add_inline_script_to_coreWeb')) {
	function add_inline_script_to_coreWeb() {
		// Path to the library file
		$lib_file_path = plugin_dir_path(__FILE__) . 'assets/core-min.js';

		// Read the file contents
		if (file_exists($lib_file_path)) {
			$inline_script = file_get_contents($lib_file_path);

			// Output the inline script
			echo "<script type='text/javascript' id='coreWeb-js'>{$inline_script}</script>";
		}
	}
	add_action('wp_head', 'add_inline_script_to_coreWeb', 1);
	add_action('enqueue_block_editor_assets', 'add_inline_script_to_coreWeb', 1);
}
//! update admin plugin svg_list paste it here
function rw_svg_list() {
	if (!current_user_can('edit_posts')) {
		wp_send_json_error('Unauthorized user', 403);
		return;
	}
	// Verify nonce for security
	if (!isset($_GET['nonce']) || !wp_verify_nonce($_GET['nonce'], 'svg_viewer_nonce')) {
		wp_send_json_error('Invalid nonce', 403);
		return;
	}
	//! update admin plugin svg_list paste after this
	$upload_dir = wp_upload_dir(); // Corrected function name to wp_upload_dir
	$svg_files = rwglob($upload_dir['basedir'] . "/*.svg");
	$file_info = array();
	foreach ($svg_files as $file) {
		$file_info[] = array(
			'nm' => basename($file),
			'url' => str_replace(
				$upload_dir['basedir'],
				$upload_dir['baseurl'],
				$file
			),
			'sz' => filesize($file),
			'ld' => date("F d Y H:i:s", filemtime($file)),
			'cd' => date("F d Y H:i:s", filectime($file)),
		);
	}
	$debug_info = array(
		//'base_dir' => $upload_dir['basedir'],
		'base_url' => $upload_dir['baseurl'],
		'files' => $file_info,
		'len' => count($svg_files)
	);
	wp_send_json_success($debug_info);
}
add_action('wp_ajax_rw_svg', 'rw_svg_list');
function rwglob($pattern, $flags = 0) {
	$files = glob($pattern, $flags);
	foreach (glob(dirname($pattern) . '/*', GLOB_ONLYDIR | GLOB_NOSORT) as $dir) {
		$files = array_merge(
			[],
			...[$files, rglob($dir . "/" . basename($pattern), $flags)]
		);
	}
	//error_log($files);
	return $files;
}
function generate_and_pass_nonce() {
	if (!is_user_logged_in()) {
		$nonce = wp_create_nonce('my_nonce_action');

		echo '<script type="text/javascript">
            var my_nonce = "' . esc_js($nonce) . '";
        </script>';
	}
}
//add_action('wp_head', 'generate_and_pass_nonce');

/* function console_log($message) {
	echo "<script>console.log(" . json_encode($message) . ");</script>";
} */
//! bad logic need to streamline/fix once i have gulp setup
/* function rwblocks_enqueue_block_assets() {
	global $CAT;
	global $BLOCKS;
	foreach ($BLOCKS as $block) {
		$config = load_php_config($block);
		if ($config && isset($config['themes'])) {
			foreach ($config['themes'] as $theme) {
				$theme_name = pathinfo($theme, PATHINFO_FILENAME);
				console_log("{$theme} $theme_name");
				wp_register_style("rw-blocks-{$block}-{$theme_name}", plugins_url("bulid/{$block}/{$theme}", __FILE__));
			}
		} // Enqueue the appropriate theme based on block attributes
		$block_content = parse_blocks(get_the_content());
		foreach ($block_content as $block_content_item) {
			//console_log("{$block_content_item['blockName']}");
			//console_log("blk: {$block_content_item['blockName']}, {$CAT}/{$block}");
			//console_log("{$block_content_item['blockName']}" === "{$CAT}/{$block}");
			if ($block_content_item['blockName'] === "{$CAT}/{$block}") {
				$theme_option = isset($block_content_item['attrs']['theme']) ? $block_content_item['attrs']['theme']  : null;
				if ($theme_option===null) {
				    $theme_option = $block_content_item['attrs']['sldAttr']['theme'];
				}
				console_log($block_content_item['attrs']);
				if ($theme_option) {
					console_log("theme: {$theme_option}");
					$theme_name = pathinfo($theme_option, PATHINFO_FILENAME);
					wp_enqueue_style("rw-blocks-{$block}-{$theme_name}");
				}
			}
		}
	}
}

add_action('wp_enqueue_scripts', 'rwblocks_enqueue_block_assets'); */
/* function rwblocks_enqueue_block_assets() {
	global $CAT;
	global $BLOCKS;

	foreach ($BLOCKS as $block) {
		$config = load_php_config($block);

		if ($config && isset($config['themes'])) {
			foreach ($config['themes'] as $theme) {
				$theme_name = pathinfo($theme, PATHINFO_FILENAME);
				$theme_ext = pathinfo($theme, PATHINFO_EXTENSION);
				$theme_path = plugins_url("build/{$block}/{$theme}", __FILE__);
				$minified_theme_path = str_replace(".{$theme_ext}", "-min.{$theme_ext}", $theme_path);

				// Debugging log
				//error_log("Theme path: {$theme_path}, Minified: {$minified_theme_path}");

				// Check if we're in the admin (edit) or frontend (view)
				if (is_admin()) {
					wp_register_style("rw-blocks-{$block}-{$theme_name}", $theme_path);
				} else {
					wp_register_style("rw-blocks-{$block}-{$theme_name}", $minified_theme_path);
				}
			}
		}

		// Enqueue the appropriate theme based on block attributes
		$block_content = parse_blocks(get_the_content());

		foreach ($block_content as $block_content_item) {
			if ($block_content_item['blockName'] === "{$CAT}/{$block}") {
				$theme_option = isset($block_content_item['attrs']['theme']) ? $block_content_item['attrs']['theme'] : null;
				if ($theme_option === null) {
					$theme_option = $block_content_item['attrs']['sldAttr']['theme'];
				}
				//error_log(print_r($block_content_item['attrs'], true));
				error_log("{$theme_option}");
				if ($theme_option) {
					$theme_name = pathinfo($theme_option, PATHINFO_FILENAME);
					error_log("{$theme_option}, {$theme_name}");
					wp_enqueue_style("rw-blocks-{$block}-{$theme_name}");
				}
			}
		}
	}
}
function rwblocks_enqueue_block_assets_1() {
	global $CAT;
	global $BLOCKS;

	$is_production = !is_admin(); // Assume production mode when not in admin
	$combined_css = '';

	// Helper function to get CSS content
	function get_css_content($block, $theme_option) {
		global $is_production;
		$theme_name = pathinfo($theme_option, PATHINFO_FILENAME);
		$theme_ext = pathinfo($theme_option, PATHINFO_EXTENSION);

		if ($is_production) {
			// Use minified CSS file for production
			$theme_full_path = plugin_dir_path(__FILE__) . "build/{$block}/{$theme_name}-min.{$theme_ext}";
		} else {
			// Use regular CSS file for edit mode
			$theme_full_path = plugin_dir_path(__FILE__) . "build/{$block}/{$theme_option}";
		}

		if (file_exists($theme_full_path)) {
			return file_get_contents($theme_full_path);
		}
		return '';
	}

	// Hook into block rendering
	add_filter('render_block', function ($block_content, $block) {
		global $CAT, $BLOCKS, $combined_css, $is_production;

		if (in_array($block['blockName'], array_map(function ($b) use ($CAT) {
			return "{$CAT}/{$b}";
		}, $BLOCKS))) {
			$config = load_php_config($block['blockName']);
			$theme_option = isset($block['attrs']['theme']) ? $block['attrs']['theme'] : null;
			if ($theme_option === null && isset($block['attrs']['sldAttr'])) {
				$theme_option = $block['attrs']['sldAttr']['theme'];
			}

			// Ensure the theme is listed in the config
			if ($config && isset($config['themes']) && in_array($theme_option, $config['themes'])) {
				$css_content = get_css_content($block['blockName'], $theme_option);
				$combined_css .= $css_content;

				if (!$is_production) {
					// Enqueue as link in edit mode
					$theme_path = plugins_url("build/{$block['blockName']}/{$theme_option}", __FILE__);
					wp_enqueue_style("rw-blocks-{$block['blockName']}-{$theme_option}", $theme_path);
				}
			}
		}
		return $block_content;
	}, 10, 2);

	// Output combined CSS inline in production mode
	if ($is_production && $combined_css) {
		add_action('wp_head', function () use ($combined_css) {
			echo "<style>{$combined_css}</style>";
		});
	}
} */

//add_action('init', 'rwblocks_enqueue_block_assets');

//add_action('wp_enqueue_scripts', 'rwblocks_enqueue_block_assets');
//add_action('enqueue_block_editor_assets', 'rwblocks_enqueue_block_assets');
