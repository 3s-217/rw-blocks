/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextareaControl } from '@wordpress/components';

import metadata from './block.json';
/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
	edit({ attributes, setAttributes }) {
		const { stylesJSON } = attributes;
		return (
			<>
				<InspectorControls>
					<PanelBody title="SVG Styles">
						<TextareaControl
							label="Styles JSON"
							help="Enter JSON to style SVG paths"
							value={stylesJSON}
							onChange={(value) => setAttributes({ stylesJSON: value })}
						/>
					</PanelBody>
				</InspectorControls>
				<div className="interactive-map-container">
					<InnerBlocks />
				</div>
			</>
		);
	},
	save({ attributes }) {
		const { stylesJSON } = attributes;
		return (
			<div className="interactive-map-container" data-styles-json={stylesJSON}>
				<InnerBlocks.Content />
			</div>
		);
	}
});
