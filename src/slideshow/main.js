import { InspectorControls, InnerBlocks, RichText, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useState, useEffect, useRef, createElement } from '@wordpress/element';
import conf from './config.json';
import metadata from './block.json';
import { queryBlocksNm, useQueryBlocks, Cel, mergeCls, mergeObj, rgx } from '../option';
const mConf = {
	cat: metadata.category,
	blks: [{
		nm: "slideshow",
		attr: {},
		prt: 0,
		args: [],
		chd: []
	},
	{
		nm: "slide",
		attr: {},
		prt: 0,
		args: [],
		chd: []
	},
	{
		nm: "slideshow-text",
		attr: {},
		prt: 0,
		args: [],
		chd: []
	},
	{
		nm: "slide-text",
		attr: {},
		prt: 0,
		args: [],
		chd: []
	}],
};
const TEMPLATE = [["rw-blocks/slide"]];
//==========================
const icof = (l, u, r, d) => ({ l, u, r, d });
const arrows = [
	['l', "🡠", "🡡", "🡢", "🡣"],
	['n', "🡨", "🡩", "🡪", "🡫"],
	['m', "🡰", "🡱", "🡲", "🡳"],
	['h', "🡸", "🡹", "🡺", "🡻"],
	['v', "🢀", "🢁", "🢂", "🢃"],
	['z', "🠸", '🠹', '🠺', '🠻'],
	['y', "🡄", '🡅', "🡆", '🡇'],
	['x', '⮜', '⮝', "⮞", '⮟'],
	['w', '⮘', '⮙', '⮚', '⮛'],
	['u', '🢔', '🢕', '🢖', '🢗'],
	['t', 'ᐊ', 'ᐃ', 'ᐅ', 'ᐁ'],
	['s', '⇚', '⤊', '⇛', '⤋'],
	['r', '', '⟰', '', '⟱'],
	['q', '', '▲', '', '▼'],
	['a', '↞', '↟', '↠', '↡'],
	['b', '⯬', '⯭', '⯮', '⯯'],
	['c', '⮈', '⮉', '⮊', '⮋'],
	['d', '«', '', '»', ''],
	['e', '❮', '', '❯', ''],
	['f', '❰', '', '❱', ''],
]
	.reduce((a, v) => (a[v.shift()] = icof(...v), a), {});
const sldObjNm = ['', 'Ar', "Ctrl", "Mv", "Nxt", "Prv", "Dots"];
//==========================
//* Main Slideshow El
function Slideshow(props) {
	const { attributes: a, edit, old } = props;
	//==========================
	const { theme, anima: { tm, run, lp },
		gui, sldCss, sldAttr, btnIco } = a;
	const blockProps = edit ? useBlockProps() : useBlockProps.save();
	const aky = (i, r) => a[`sld${i}${r ? "Css" : "Attr"}`];
	const slda = (key) => ({ attr: aky(key), css: aky(key, 1) });
	if (sldAttr.className) delete sldAttr.className;
	sldObjNm.forEach(v => (aky(v).class) ? delete v.class : 0);
	let eo;
	if (edit && props?.clientId)
		try {
			let e = useQueryBlocks("rw-blocks/slide", props?.clientId);
			eo = e?.length ?? eo;
		} catch (e) { __o.log(e); }
	//==========================
	//if (blockProps?.style) __o.log('editor set css', blockProps.style);
	return (
		<Cel el="s-bx"
			attr={mergeObj(sldAttr, blockProps)}
			cls={`rw-blocks-slideshow alignfull ${theme ?? ''}`}
			cb={v => !/^((wp-block-rw-blocks-\w+)| (w*(-blocks - slideshow)))$/.test(v)}
			css={mergeObj(sldCss, blockProps.style)}
			more={{
				anima: run ? '' : !!run, tm,
				lp: lp ? '' : !!lp,
				control: gui ? "" : null,
				theme: theme && theme != '' ? theme : null
			}}
		>
			<Cel cls='slides-area' {...slda("Ar")}>
				{edit ?
					<InnerBlocks
						template={TEMPLATE}
						allowedBlocks={TEMPLATE[0]}
					/> :
					<InnerBlocks.Content />
				}
			</Cel>
			<Cel cls='slide-ctrl' {...slda("Ctrl")}>
				<Cel cls='slide-mv' {...slda("Mv")}>
					{[['prev', 'Prv'], ['next', "Nxt"]]
						.map((v, i) => (
							<Cel cls={v[0]}
								more={gui ? { 'aria-label': v[0] + ' slide' } : {}}
								{...slda(v[1])}
							>
								{gui ? <span>{a[`${v[0]}Btn`][btnIco.split("")[i]]}</span> : ""}
							</Cel>
						))
					}
				</Cel>
				<Cel
					cls='slide-dots'
					more={gui ? { 'aria-label': 'Slide navigation' } : {}}
					{...slda("Dots")}
				>{eo && gui && edit ? Array.from({ length: eo }, () => <div className='dot'></div>) : null}</Cel>
			</Cel>
		</Cel >
	);
}
//* Main Slide El
function Slide({ attributes: a, setAttributes: sattr, edit }) {
	const blockProps = edit ? useBlockProps() : useBlockProps.save();
	const f = (v, i) => `sld${v}${i ? 'Css' : "Attr"}`;
	const ob = (i, v) => ({
		cls: "slide" + i,
		attr: a[f(v)],
		css: v !== "Ar" ? mergeObj(a[f(v, 1)], blockProps.style) : a[f(v, 1)]
	});
	const Tp = a.txt ? RichText : InnerBlocks;
	const Ed = edit ? Tp : Tp.Content;
	return (
		<Cel {...ob('', '')}>
			<Cel {...ob('-content', 'Ar')}>
				{(edit ? <Ed {...a.txt ? { onChange(t) { sattr({ text: t }); }, value: a.text } : {}} /> :
					<Ed {...a.txt ? { value: a.text } : {}} />)}
			</Cel>
		</Cel>
	);
}
function SldShwTxt(props) {
	const { attributes: a, edit, setAttributes: sattr } = props;
	const blockProps = edit ? useBlockProps() : useBlockProps.save();
	const a1 = RichText, a2 = InnerBlocks, e = createElement,
		{ before, after, attr, css } = a,
		f = i => edit ? i : i.Content;
	const cls = "rw-blocks-slideshow-text";
	return (
		<Cel attr={mergeObj(attr, blockProps)}
			css={mergeObj(css, blockProps.style)}
			cls={cls}
			el={a.type.length ? a.type : 'div'}
			cb={v => (!/^(wp-block-rw-blocks-\w+)/.test(v))}>
			{e(f(a1), { onChange: t => sattr({ before: t }), value: before })}
			{e(f(a2), { allowedBlocks: ["rw-blocks/slideshow", "rw-blocks/slide", "rw-blocks/rw-any"] })}
			{e(f(a1), { onChange: t => sattr({ after: t }), value: after })}
		</Cel>
	);
}
/**
 * @typedef {import('@wordpress/element').WPComponent} WPComponent
 * @typedef {import('@wordpress/block-editor').BlockEditProps} BlockEditProps
 * @typedef {import('@wordpress/block-editor').BlockSaveProps} BlockSaveProps
 * @typedef {import('@wordpress/data').DispatchFromMap} DispatchFromMap
 * @typedef {import('@wordpress/data').SelectFromMap} SelectFromMap
 * @typedef {Object<string,any>} Attributes
 * @typedef {Object<string,any>} CSS
 * @typedef {Object<string,any>} Attr
 *
 * @param {BlockEditProps|BlockSaveProps} props
 * @property {Attributes} attributes
 * @property {DispatchFromMap} setAttributes
 * @property {boolean} edit
 * @property {Object<string, any>} blockProps
 * @property {string} text
 * @property {Attr} attr
 * @property {CSS} css
 * @property {string} type
 * @property {boolean} txt
 *
 * @returns {WPComponent}
 *
 * @description
 * This function renders a generic element with the given attributes.
 * It accepts a type attribute to render the element with a different tag name.
 * The element is rendered with the class name "rwAny".
 * When the type attribute is set to "script" or "style", the element's innerHTML is set to the text attribute.
 * Otherwise, the element is rendered as a RichText or InnerBlocks element, depending on the txt attribute.
 * If the txt attribute is true, the element is rendered as a RichText element.
 * If the txt attribute is false, the element is rendered as an InnerBlocks element.
 * The element is rendered with the given CSS and attributes.
 * The element is rendered with the given blockProps.
 *
 * @example
 *
 * <RwAny
 * 	type="div"
 * 	text="Hello World!"
 * 	attr={{ className: "my-class" }}
 * 	css={{ color: "red" }}
 * />
 *
 * @example
 *
 * <RwAny
 * 	type="script"
 * 	text="console.log('Hello World!');"
 * />
 *
 * @example
 *
 * <RwAny
 * 	type="style"
 * 	text=".my-class { color: red; }"
 * />
 *
 * @example
 *
 * <RwAny
 * 	type="div"
 * 	txt={true}
 * 	attr={{ className: "my-class" }}
 * 	css={{ color: "red" }}
 * >
 * 	<p>Hello World!</p>
 * </RwAny>
 *
 * @example
 *
 * <RwAny
 * 	type="div"
 * 	txt={false}
 * 	attr={{ className: "my-class" }}
 * 	css={{ color: "red" }}
 * >
 * 	<RwAny
 * 		type="p"
 * 		text="Hello World!"
 * 	/>
 * </RwAny>
 */
function RwAny(props) {
	const { attributes: a, edit, setAttributes: sattr } = props;
	const blockProps = edit ? useBlockProps() : useBlockProps.save();
	//const { children, ...innerBlocksProps } = useInnerBlocksProps();
	const { text, attr, css, type, txt } = a;
	const spl = rgx('script|style', type);
	const cls = "rwAny";
	const Tdo = txt && !spl ? RichText : spl ? Txtpure : InnerBlocks,
		Fl = edit ? Tdo : spl ? Tdo : Tdo.Content;
	if (spl && !txt) sattr({ txt: !!1 });
	//__o.log(type, spl, text);
	return (
		!edit && a.pure && !spl ?
			<>{(text?.replace(/(^\n+)|(\n+$)/i, ''))}</> :
			<Cel attr={mergeObj(attr, blockProps)}
				css={mergeObj(css, blockProps.style)}
				cls={cls}
				el={type.length ? type : 'div'}
				cb={v => (!/^(wp-block-rw-blocks-\w+)/.test(v))}
				{...!edit && spl ? { more: { dangerouslySetInnerHTML: { __html: text } } } : {}}
			>
				{edit && canHaveChildren(type) ? (
					<Fl
						{...txt ? {
							onChange(v) { sattr({ text: __o.utils.type(v, 'str') ? v : v.target.value }); },
							value: text,
							placeholder: 'Text',
							.../*spl ? */ { spellcheck: false } //: {}
						} : {}}
					/>
				) :
					!edit && !spl && canHaveChildren(type) ? (
						<Fl {...txt ? { value: text } : {}} />)
						: null}
			</Cel>
	);
}
function RwTxt(props) {
	const { attributes: a, setAttributes: sattr, edit } = props;
	const Tdo = edit ? RichText : RichText.Content;
	const en = <Tdo
		onChange={v => sattr({ text: v })}
		value={a.text}
	/>;
	__o.log(edit ? 'n' : 'f', en);
	return (
		edit ? en : a.text
	);
}
const noChildrenElements = [
	'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen',
	'link', 'meta', 'param', 'source', 'track', 'wbr', 'basefont',
	'bgsound', 'frame', 'isindex', 'iframe', 'canvas'
];

function canHaveChildren(tag) {
	return !noChildrenElements.includes(tag.toLowerCase());
}
//======================================
export { Slideshow, Slide, SldShwTxt, RwAny, RwTxt, arrows, sldObjNm };
//======================================
{
	let attr, css, ico;
	let obj = {
		Sld: { css, attr },
		Area: { css, attr },
		Ctrl: { css, attr },
		Mv: { css, attr },
		Nxt: { css, attr, ico },
		Prv: { css, attr, ico },
		Dots: { css, attr },
		anima: !!0,
		gui: !!0,
		lp: !!0
	};
	/* 	const svg = (d, f) => (<svg width="100%" height="100%" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d={d} fill={f}></path></svg>);
	const dv = (c, d, f = "#FFF38A") => <div className={`${c} btn`}>{svg(d, f)}</div>; */
};
function Txtpure({ onChange, placeholder, value }) {
	return (<Cel el="textarea"
		attr={{ onChange, value, placeholder }} />);
};
