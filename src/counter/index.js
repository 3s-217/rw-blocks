import './style.scss';
import './editor.scss';
import { registerBlockType, getChildBlockNames, getBlockType } from '@wordpress/blocks';
import { InspectorControls, InnerBlocks, RichText, useBlockProps, } from '@wordpress/block-editor';
import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	TabPanel, Panel, PanelBody, TextControl, ToggleControl, FormToggle,
	SelectControl, ComboboxControl,
	Button, ToggleGroupControl,
	ColorIndicator, ColorPicker, GradientPicker,
	Popover, Modal,
	Toolbar,
	//easy for css
	BoxControl, BorderBoxControl, HeightControl
} from '@wordpress/components';
import { Cel, ErrorBoundary, SetKeyVals, mergeObj } from '../option';
import metadata from './block.json';
const dsup = {
	//html: false,
	anchor: true,
	ariaLabel: true,
	align: true,
	color: {
		gradients: true,
		//heading: true,
		//button: true,
		//link: true,
		border: true
	},
	background: {
		backgroundImage: true,
		backgroundSize: true
	},
	spacing: {
		margin: true,
		padding: true,
		blockGap: true,
		__experimentalDefaultControls: {
			margin: false,
			padding: false,
			blockGap: false,
		}
	},
	typography: {
		fontSize: true,
		lineHeight: true,
		textAlign: true,
		__experimentalTextTransform: true,
		__experimentalTextDecoration: true,
		__experimentalLetterSpacing: true,
		__experimentalFontStyle: true,
		__experimentalDefaultControls: {
			fontSize: false,
			lineHeight: false,
			textAlign: false,
		}
	},
	__experimentalBorder: {
		color: true,
		style: true,
		width: true,
		radius: true,
		__experimentalDefaultControls: {
			color: false,
			style: false,
			width: false,
			radius: false,
		}
	},
	__experimentalTypography: {
		fontSize: true,
		fontStyle: true,
		fontWeight: true,
		lineHeight: true,
		fontFamily: true,
		textTransform: true,
		textDecoration: true,
		textAlign: true,
		__experimentalDefaultControls: {
			fontSize: false,
			fontStyle: false,
			fontWeight: false,
			lineHeight: false,
			fontFamily: false,
			textTransform: false,
			textDecoration: false,
			textAlign: false,
		}
	}
};
registerBlockType(metadata.name, {
	supports: dsup,
	attributes: {
		min: { type: "number", default: 0 },
		max: { type: "number", default: 0 },
		sym: { type: "string", default: "%" },
		attr: { type: "object", default: {} },
		css: { type: 'object', default: { /* position: 'relative', zIndex: 1  */ } }
	},
	selector: {
		"root": ".rw-blocks-counter"
	},
	//extends: "core/paragraph",
	edit: (props) => <RwCounter {...props} edit={1} />,
	save: (props) => <RwCounter {...props} />,
	deprecated: [{
		save: (props) => <RwCounter {...props} old={1} />,
	}]
});
/**
 * A stateless functional component to render the RwCounter block.
 * @param {object} props - Component props.
 * @param {object} props.attributes - Block attributes.
 * @param {object} props.attributes.attr - HTML attributes.
 * @param {object} props.attributes.css - CSS styles.
 * @param {number} props.attributes.min - Minimum value.
 * @param {number} props.attributes.max - Maximum value.
 * @param {string} props.attributes.sym - Symbol to append to the value.
 * @param {boolean} props.edit - Whether the block is being edited.
 * @returns {object} - A JSX element.
 */
function RwCounter(props) {
	const { attributes: a, edit } = props;
	const { attr, css, min, max, sym } = a;
	const blockProps = edit ? useBlockProps() : useBlockProps.save();
	//__o.log(blockProps);
	const el = max + sym;
	return (<>
		{edit ? <Opt {...props} /> : null}
		<Cel
			{...{
				attr: mergeObj(attr, blockProps),
				cls: "rw-blocks-counter",
				css: mergeObj(css, blockProps.style),
				more: { min, max, sym, role: 'document' }
			}}>
			{el}
		</Cel>
	</>
	);
}
function Opt({ attributes: a, setAttributes: sattr }) {
	return (
		<InspectorControls>
			<div style={{ padding: "0 1.3em" }}>
				<TextControl
					label="min"
					value={a.min}
					placeholder='default'
					type="number"
					onChange={(v) => sattr({ min: Number(v) })}
				/>
				<TextControl
					label="max"
					value={a.max}
					placeholder='default'
					type="number"
					onChange={(v) => sattr({ max: Number(v) })}
				/>
				<TextControl
					label="symbol"
					value={a.sym}
					placeholder='default'
					onChange={(v) => sattr({ sym: v })}
				/>
				{/* <SelectControl
					label={__('Text Alignment', 'rw-blocks')}
					value={a.css.textAlign}
					options={[
						{ label: __('None', 'rw-blocks'), value: '' },
						{ label: __('Left', 'rw-blocks'), value: 'left' },
						{ label: __('Center', 'rw-blocks'), value: 'center' },
						{ label: __('Right', 'rw-blocks'), value: 'right' },
						{ label: __('Justify', 'rw-blocks'), value: 'justify' },
					]}
					onChange={(newAlign) => updateCss('textAlign', newAlign)}
				/> */}
				<PanelBody initialOpen={!!0} title="Exterme Adv.">
					<Panel>
						{
							[
								["Styles", "Set css using JS Api name", "css"],
								["Attributes", "!! Set React props there is no safeguard !!", "attr"]
							].map((v, i) => (
								<PanelBody title={v[0]} initialOpen={!!0} key={i}>
									<div style={{ color: 'red' }}>{v[1]}</div>
									<br />
									<SetKeyVals
										attributes={a}
										setAttributes={sattr}
										attributeKey={`${v[2]}`}
										isCss={i == 0}
									/>
								</PanelBody>
							))
						}
					</Panel>
				</PanelBody>
			</div>
		</InspectorControls>
	);
}

