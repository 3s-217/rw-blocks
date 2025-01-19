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
import './style.scss';
import './css/inf-h.scss';
//import './css/theme1.scss';
import './editor.scss';
/**
 * Internal dependencies
 */
import { InspectorControls, InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect, useRef } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
//import {DynamicKeyValuePair} from '../option';
import metadata from './block.json';
import { Slideshow, Slide, arrows, sldObjNm } from './main.js';
import { ErrorBoundary } from '../option.js';
import { BlkOpt, SldOpt } from './edit.js';
import "./view";
const attrf = (d, t = "object") => ({ type: t, default: d });
const csat = ({ i, c, a } = {}) => attrf({ css: c ?? {}, attr: a ?? {}, ico: i });
const grp = (ar, cb) => Object.fromEntries(ar.map(cb));
const fg = ["Css", "Attr"].map(v => grp(sldObjNm, u => [`sld${u}${v}`, attrf({})]))
	.reduce((a, c) => ({ ...a, ...c }), {});
//__o.log(fg);
const dattrs = {
	theme: attrf('', 'string'),
	...fg,
	sldType: attrf({}),
	nextBtn: attrf(arrows.l),
	prevBtn: attrf(arrows.l),
	btnIco: attrf('lr', 'string'),
	gui: attrf(1, 'bool'),
	anima: attrf({ run: 0, tm: 0, lp: 0 }),
	//dots: attrf({}),
	ijson: attrf('', 'string'),
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

//* Main block reg.
registerBlockType(metadata.name, {
	attributes: dattrs,
	edit(props) {
		const { attributes: a, setAttributes, parentIndex: pi, parentNode: pn, slideCount: s } = props;
		return (
			<ErrorBoundary>
				<BlkOpt {...props} />
				<Slideshow {...props} edit={1} />
			</ErrorBoundary>
		);
	},
	save: (props) => <Slideshow {...props} />,
});
//================
registerBlockType('rw-blocks/slide', {
	title: "slide",
	version: metadata.version,
	description: "Slide for slideshow",
	category: 'rw-blocks',
	icon: "slides",
	parent: metadata.name,
	attributes: {
		...grp(['Sld', 'Area'], v => [v, csat()]),
		...grp(['', 'Ar'], v => [`sld${v}Css`, attrf({})],),
		...grp(['', 'Ar'], v => [`sld${v}Attr`, attrf({})],),
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

