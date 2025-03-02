/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import { registerBlockType, getChildBlockNames, getBlockType } from '@wordpress/blocks';
//import { __ } from '@wordpress/ii8n';
import { addFilter } from '@wordpress/hooks';
import './style.scss';
import './editor.scss';

/**
 * Internal dependencies
 */
import { InspectorControls, InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Panel } from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
//import {DynamicKeyValuePair} from '../option';
import metadata from './block.json';
import { Slideshow, Slide, SldShwTxt, arrows, sldObjNm, RwAny, RwTxt } from './main.js';
import { ErrorBoundary, Cel, mergeObj, SetKeyVals } from '../option.js';
import { BlkOpt, SldOpt, SldTxtOpt, RwAnyOpt } from './edit.js';
import "./view";
const { category, version } = metadata;
const attrf = (d, t = "object", ex) => ({ type: t, default: d, ...(ex ?? {}) });
const csat = ({ i, c, a } = {}) => attrf({ css: c ?? {}, attr: a ?? {}, ico: i });
const grp = (ar, cb) => Object.fromEntries(ar.map(cb));
const dsup = {
	//html: false,
	anchor: true,
	ariaLabel: true,
	color: {
		gradients: true,
		/* 		heading: true,
				button: true, */
		link: true,
		border: true
	},
	background: {
		backgroundImage: true,
		backgroundSize: true
	},
	spacing: {
		margin: true,  // Enable margin UI control.
		padding: true, // Enable padding UI control.
		blockGap: true,  // Enables block spacing UI control for blocks that also use `layout`.
		height: true
	},
	border: {
		width: true,
		style: true,
		radius: true
	},
	typography: {
		fontSize: true,
		fontStyle: true,
		fontWeight: true,
		lineHeight: true,
		fontFamily: true,
		textTransform: true,
		textDecoration: true
	},
};
//=====================================
//console.log(conf, sldtypes);
/* const edit = compose(withSelect((select, ownProps) => {
	const { getBlockOrder, getBlockIndex, getBlockParentsByBlockName } = select('core/block-editor');
	const { clientId } = ownProps;
	const parentBlocks = getBlockParentsByBlockName(clientId, 'rw-block/slideshow');
	const parentIndex = parentBlocks.length ? getBlockIndex(parentBlocks[0]) : null;
	const parentNode = parentBlocks.length ? parentBlocks[0] : null;
	const slideCount = parentBlocks.length ? getBlockOrder(parentBlocks[0])
		.filter((blockClientId) => select('core/block-editor')
			.getBlockName(blockClientId) === 'rw-block/slide').length :
		0;
	return { parentIndex, parentNode, slideCount };
}))(SliderControl); */
function enb(acc, v) { return { ...acc, [v[0]]: !!v[1] }; }
//* Main block reg.
registerBlockType(metadata.name, {
	attributes: {
		theme: attrf('', 'string'),
		...["Css", "Attr", "Type"].map(v => grp(sldObjNm, u => [`sld${u}${v}`, attrf({})]))
			.reduce((a, c) => ({ ...a, ...c }), {}),
		sldType: attrf({}),
		nextBtn: attrf(arrows.l),
		prevBtn: attrf(arrows.l),
		btnIco: attrf('lr', 'string'),
		gui: attrf(1, 'bool'),
		anima: attrf({ run: 0, tm: 0, lp: 0 }),
		cmt: attrf('', 'string'),
	},
	supports: {
		//html: false,
		anchor: true,
		ariaLabel: true,
		color: [['gradients', 1], ['link', 1], ['border', 1]].reduce(enb, {}),
		background: [['backgroundImage', 1], ['backgroundSize', 1]].reduce(enb, {}),
		spacing: [['margin', 1], ['padding', 1], ['blockGap', 1], ['height', 1]].reduce(enb, {}),
		border: [['width', 1], ['style', 1], ['radius', 1]].reduce(enb, {}),
		typography: [
			['lineHeight', 1],
			...[['Size', 1], ['Style', 1], ['Weight', 1], ['Family', 1]].map(v => ['font' + v[0], v[1]]),
			...[['Transform', 1], ['Decoration', 1]].map(v => ['text' + v[0], v[1]]),
		]
			.reduce(enb, {})
	},
	icon: (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 122.88 97.05" fill="red" stroke="red">
		<path d="M9.35,37.38c0.85-0.9,2.27-0.93,3.17-0.08c0.9,0.85,0.93,2.27,0.08,3.16l-7.26,7.6l7.26,7.62c0.85,0.9,0.82,2.31-0.08,3.16 c-0.9,0.85-2.31,0.82-3.17-0.08l-8.73-9.17c-0.82-0.86-0.83-2.22,0-3.09L9.35,37.38L9.35,37.38L9.35,37.38z M74.98,46.57 l-7.17-6.88l-1.51,9.29c-0.03,0.18-0.08,0.37-0.17,0.53c-0.08,0.16-0.21,0.32-0.36,0.44c-0.32,0.27-0.73,0.39-1.12,0.37 c-0.39-0.03-0.77-0.21-1.05-0.54L52.63,36.81L40.56,47.18v5.79H82.3V39.51l-6.69,7.01c-0.07,0.11-0.2,0.18-0.33,0.18 C75.15,46.69,75.05,46.65,74.98,46.57L74.98,46.57L74.98,46.57L74.98,46.57z M75.24,42.53l7.06-7.74V20.02h0.01H40.56v22.97 c3.48-3.15,7.66-6.61,11.21-9.59c0.32-0.27,0.71-0.39,1.08-0.37c0.39,0.02,0.77,0.19,1.05,0.49l0.01,0.02 c0.02,0.02,0.03,0.03,0.05,0.06l9.8,11.59l1.46-8.94c0.08-0.41,0.31-0.75,0.62-0.98c0.31-0.22,0.71-0.34,1.13-0.27l0.04,0.01 c0.15,0.03,0.29,0.08,0.42,0.14c0.14,0.07,0.27,0.16,0.39,0.27L75.24,42.53L75.24,42.53L75.24,42.53L75.24,42.53z M67.87,22.87 c0.6,0,1.2,0.13,1.74,0.35c0.56,0.23,1.06,0.57,1.48,0.99c0.42,0.42,0.76,0.92,1,1.48c0.22,0.54,0.34,1.13,0.34,1.74 s-0.13,1.2-0.34,1.73c-0.23,0.56-0.57,1.06-0.99,1.48c-0.42,0.42-0.92,0.76-1.48,0.99c-0.54,0.23-1.12,0.35-1.73,0.35 c-0.6,0-1.2-0.13-1.74-0.35c-0.56-0.23-1.05-0.57-1.48-0.99c-0.42-0.42-0.76-0.92-1-1.48c-0.22-0.54-0.34-1.12-0.34-1.73 c0-0.6,0.13-1.2,0.34-1.74c0.23-0.56,0.57-1.06,0.99-1.48c0.42-0.42,0.92-0.76,1.48-0.99C66.67,22.99,67.25,22.87,67.87,22.87 L67.87,22.87L67.87,22.87L67.87,22.87z M69.24,26.06c-0.18-0.18-0.39-0.32-0.63-0.43c-0.22-0.09-0.48-0.14-0.74-0.14 c-0.26,0-0.51,0.05-0.74,0.14c-0.24,0.1-0.45,0.25-0.63,0.42c-0.18,0.18-0.32,0.39-0.42,0.63c-0.09,0.23-0.14,0.48-0.14,0.74 c0,0.25,0.05,0.51,0.14,0.74c0.1,0.24,0.25,0.45,0.42,0.63c0.18,0.18,0.39,0.32,0.63,0.43c0.22,0.09,0.48,0.14,0.74,0.14 c0.26,0,0.51-0.05,0.74-0.14c0.24-0.1,0.45-0.25,0.63-0.42c0.18-0.18,0.32-0.39,0.42-0.63c0.09-0.23,0.14-0.48,0.14-0.74 c0-0.26-0.05-0.51-0.14-0.74C69.56,26.45,69.41,26.24,69.24,26.06L69.24,26.06L69.24,26.06L69.24,26.06z M39.83,83.73 c-1.39,0-2.51-1.13-2.51-2.51c0-1.39,1.12-2.51,2.51-2.51h42.5c1.39,0,2.51,1.13,2.51,2.51c0,1.39-1.12,2.51-2.51,2.51H39.83 L39.83,83.73L39.83,83.73z M40.3,71.65c-1.39,0-2.51-1.13-2.51-2.51c0-1.39,1.12-2.51,2.51-2.51h21.96c1.39,0,2.51,1.13,2.51,2.51 c0,1.39-1.12,2.51-2.51,2.51H40.3L40.3,71.65L40.3,71.65z M40.93,16.14h41.02c1.16,0,2.22,0.48,2.98,1.24l0.01,0.01 c0.77,0.77,1.24,1.82,1.24,2.98v32.23c0,1.16-0.48,2.22-1.24,2.98l-0.01,0.01c-0.77,0.77-1.82,1.24-2.98,1.24H40.93 c-1.16,0-2.22-0.48-2.98-1.24l-0.01-0.01c-0.77-0.77-1.24-1.82-1.24-2.98V20.38c0-1.16,0.48-2.22,1.24-2.98l0.01-0.01 C38.71,16.62,39.77,16.14,40.93,16.14L40.93,16.14L40.93,16.14z M110.28,40.47c-0.85-0.9-0.82-2.31,0.08-3.16 c0.9-0.85,2.31-0.82,3.17,0.08l8.73,9.14c0.83,0.87,0.82,2.23,0,3.09l-8.73,9.17c-0.85,0.9-2.27,0.93-3.17,0.08 c-0.9-0.85-0.93-2.27-0.08-3.16l7.26-7.62L110.28,40.47L110.28,40.47L110.28,40.47z M25.31,0h72.26c1.21,0,2.31,0.5,3.11,1.3 l0.01,0.01c0.8,0.8,1.29,1.9,1.29,3.11v88.22c0,1.21-0.5,2.31-1.3,3.11l-0.01,0.01c-0.8,0.8-1.9,1.29-3.11,1.29l-72.25,0 c-1.2,0-2.31-0.5-3.11-1.3l-0.01-0.01c-0.8-0.8-1.29-1.9-1.29-3.11V4.42c0-1.21,0.5-2.31,1.3-3.11l0.01-0.01 C23,0.49,24.1,0,25.31,0L25.31,0L25.31,0z M97.5,4.47H25.37v88.1h72.15V4.47H97.5L97.5,4.47z" />
	</svg>),
	edit(props) {
		return (
			<ErrorBoundary>
				<BlkOpt {...props} />
				<Slideshow {...props} edit={1} />
			</ErrorBoundary >
		);
	},
	save: (props) => <Slideshow {...props} />,
	//deprecated: [{ attributes: dattrs, save: (props) => <Slideshow {...props} old={1} /> }]
});
//================
registerBlockType('rw-blocks/slide', {
	title: "slide",
	version,
	description: "Slide for slideshow",
	category,
	icon: "slides",
	parent: metadata.name,
	supports: dsup,
	se: 'add any block...',
	attributes: {
		...grp(['Sld', 'Area'], v => [v, csat()]),
		...grp(['', 'Ar'], v => [`sld${v}Css`, attrf({})]),
		...grp(['', 'Ar'], v => [`sld${v}Attr`, attrf({})]),
		text: attrf('', 'string'/* , { source: "html" } */),
		txt: attrf(0, 'bool'),
		cmt: attrf('', 'string'),
	},
	edit: compose(withSelect((select, ownProps) => {
		const { getBlockOrder, getBlockIndex, getBlockParentsByBlockName, getBlocks, getBlocksByName, getBlockName } = select('core/block-editor');
		const { clientId } = ownProps;
		const allBlk = getBlocksByName('rw-blocks/slideshow');
		const prtBlks = getBlockParentsByBlockName(clientId, 'rw-blocks/slideshow');
		const l = prtBlks.length, i = l ? prtBlks[0] : -1;
		const p = l ? allBlk.findIndex(b => b === i) : null;
		const o = getBlockOrder(i);
		return {
			prtIdx: p,
			prtNode: l ? allBlk[p] : null,
			sldCnt: l ? o.filter(bid => getBlockName(bid) === 'rw-blocks/slide').length : 0,
			sldIdx: prtBlks.length ? o.findIndex(id => id === clientId) : null,
			sldshowIdx: p,
		};
	}))(SldOpt),
	save: Slide
});
registerBlockType("rw-blocks/slideshow-text", {
	title: "slideshow-text",
	version,
	description: "inline text slideshow",
	category,
	icon: "text",
	attributes: {
		attr: attrf({}),
		css: attrf({}),
		before: attrf('', 'string'),
		after: attrf('', 'string'),
		type: attrf('', 'string'),
		cmt: attrf('', 'string'),
	},
	supports: {
		ariaLabel: true,
		align: true,
		color: {
			gradients: true,
			/* heading: true,
			button: true,
			link: true, */
			border: true,
			__experimentalDefaultControls: {
				link: false,
				button: false,
				heading: false
			}
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
			__experimentalfontWeight: true,
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
	},
	edit(props) {
		return <ErrorBoundary>
			<SldTxtOpt {...props} />
			<SldShwTxt {...props} edit={1} />
		</ErrorBoundary>;
	},
	save: (props) => <SldShwTxt {...props} />,
});
registerBlockType("rw-blocks/rw-any", {
	title: "rw-any",
	version,
	description: `A block that can be anything`,
	category,
	icon: "layout",
	supports: {
		ariaLabel: true,
		align: true,
		color: {
			gradients: true,
			/* heading: true,
			button: true,*/
			link: true,
			border: true,
			__experimentalDefaultControls: {
				link: false,
				button: false,
				heading: false
			}
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
			__experimentalfontWeight: true,
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
		__experimentalTypography: [
			['lineHeight', 1],
			[...[['Size', 1], ['Style', 1], ['Weight', 1], ['Family', 1]].map(v => ['font' + v[0], v[1]])],
			[...[['Transform', 1], ['Decoration', 1], ['Align', 1]].map(v => ['text' + v[0], v[1]])]
		].reduce(enb, {
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
		}),
	},
	attributes: {
		attr: attrf({}),
		css: attrf({}),
		text: attrf('', 'string'/* , { source: "html" } */),
		txt: attrf(0, 'bool'),
		type: attrf('', 'string'),
		pure: attrf(0, 'bool'),
		cmt: attrf('', 'string'),
	},
	edit(props) {
		return <ErrorBoundary>
			< RwAnyOpt {...props} />
			<RwAny {...props} edit={1} />
		</ErrorBoundary >;
	},
	save: (props) => <RwAny {...props} />
});
/* addFilter('blocks.getSaveElement', metadata.name, (...args) => {
	if (args[1].name == metadata.name)
		__o.log(args[0]);
	return args[0];
}); */
/* registerBlockVariant("core/header", {title: "rw-header"}); */
//==================
{/* <div {...blockProps} className={"timeline-section alignfull " + blockProps.className} style={mergedCSS} {...sldAttr}>
				<div className='timeline-slides'>
					{edit ?
						<InnerBlocks
							template={TEMPLATE}
							allowedBlocks={["rw-block/slide"]}
						//templateLock="all" // Lock the outer structure
						/> :
						<InnerBlocks.Content />
					}
				</div>
				<div className='timeline-actions'>
					<div className="timeline-move">
						{dv('prev',
							"M35.5 12C35.5 12.3315 35.3683 12.6495 35.1339 12.8839C34.8995 13.1183 34.5815 13.25 34.25 13.25L4.7675 13.25L12.635 21.115C12.8697 21.3497 13.0016 21.6681 13.0016 22C13.0016 22.3319 12.8697 22.6503 12.635 22.885C12.4003 23.1197 12.0819 23.2516 11.75 23.2516C11.4181 23.2516 11.0997 23.1197 10.865 22.885L0.864997 12.885C0.748592 12.7689 0.656234 12.6309 0.593219 12.4791C0.530204 12.3272 0.497764 12.1644 0.497764 12C0.497764 11.8356 0.530204 11.6728 0.593219 11.5209C0.656234 11.369 0.748592 11.2311 0.864997 11.115L10.865 1.11499C11.0997 0.880274 11.4181 0.748412 11.75 0.748412C12.0819 0.748412 12.4003 0.880274 12.635 1.11499C12.8697 1.34971 13.0016 1.66805 13.0016 1.99999C13.0016 2.33193 12.8697 2.65027 12.635 2.88499L4.7675 10.75L34.25 10.75C34.5815 10.75 34.8995 10.8817 35.1339 11.1161C35.3683 11.3505 35.5 11.6685 35.5 12Z"
						)}
						{dv('next',
							"M0.5 12C0.5 11.6685 0.631696 11.3505 0.866117 11.1161C1.10054 10.8817 1.41848 10.75 1.75 10.75L31.2325 10.75L23.365 2.88501C23.1303 2.65029 22.9984 2.33195 22.9984 2.00001C22.9984 1.66807 23.1303 1.34972 23.365 1.11501C23.5997 0.880289 23.9181 0.748429 24.25 0.748429C24.5819 0.748429 24.9003 0.880289 25.135 1.11501L35.135 11.115C35.2514 11.2311 35.3438 11.3691 35.4068 11.5209C35.4698 11.6728 35.5022 11.8356 35.5022 12C35.5022 12.1644 35.4698 12.3272 35.4068 12.4791C35.3438 12.631 35.2514 12.7689 35.135 12.885L25.135 22.885C24.9003 23.1197 24.5819 23.2516 24.25 23.2516C23.9181 23.2516 23.5997 23.1197 23.365 22.885C23.1303 22.6503 22.9984 22.3319 22.9984 22C22.9984 21.6681 23.1303 21.3497 23.365 21.115L31.2325 13.25L1.75 13.25C1.41848 13.25 1.10054 13.1183 0.866117 12.8839C0.631696 12.6495 0.5 12.3315 0.5 12Z"
						)}
					</div>
					<div className="timeline-dots"></div>
				</div>
			</div> */}

function wpSupportOpts() {

}
