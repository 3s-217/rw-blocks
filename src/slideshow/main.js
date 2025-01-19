import { InspectorControls, InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect, useRef } from '@wordpress/element';
import conf from './config.json';
import { queryBlocksNm, useQueryBlocks } from '../option';
const TEMPLATE = [["rw-blocks/slide"]];
//==========================
const icof = (l, u, r, d) => ({ l, u, r, d });
const arrows = {
	l: icof("🡠", "🡡", "🡢", "🡣"),
	n: icof("🡨", "🡩", "🡪", "🡫"),
	m: icof("🡰", "🡱", "🡲", "🡳"),
	h: icof("🡸", "🡹", "🡺", "🡻"),
	v: icof("🢀", "🢁", "🢂", "🢃"),
	z: icof("🠸", '🠹', '🠺', '🠻'),
	y: icof("🡄", '🡅', "🡆", '🡇'),
	x: icof('⮜', '⮝', "⮞", '⮟'),
	w: icof('⮘', '⮙', '⮚', '⮛'),
	u: icof('🢔', '🢕', '🢖', '🢗'),
	t: icof('ᐊ', 'ᐃ', 'ᐅ', 'ᐁ'),
	s: icof('⇚', '⤊', '⇛', '⤋'),
	r: icof('', '⟰', '', '⟱'),
	q: icof('', '▲', '', '▼'),
	a: icof('↞', '↟', '↠', '↡'),
	b: icof('⯬', '⯭', '⯮', '⯯'),
	c: icof('⮈', '⮉', '⮊', '⮋'),
	d: icof('«', '', '»', ''),
	e: icof('❮', '', '❯', ''),
	f: icof('❰', '', '❱', ''),
};
const sldObjNm = ['', 'Ar', "Ctrl", "Mv", "Nxt", "Prv", "Dots"];
const mergeObj = (props, extra) => { return Object.assign({}, props, extra); };
const mergeCls = (base, extra) => { return base.split(" ").concat(extra).join(" "); };
//==========================
//* Main Slideshow El
function Slideshow(props) {
	const { attributes: a, edit } = props;
	/* 	const svg = (d, f) => (<svg width="100%" height="100%" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path fill-rule="evenodd" clip-rule="evenodd" d={d} fill={f}></path></svg>);
		const dv = (c, d, f = "#FFF38A") => <div className={`${c} btn`}>{svg(d, f)}</div>; */
	//==========================
	const { theme, anima: { tm, run, lp }, gui,
		sldCss, sldAttr, btnIco,
	} = a;
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
			//__o.log('qy', props, e);
		} catch (e) { __o.log(e); }
	//==========================
	return (
		<Cel
			attr={{ ...mergeObj(sldAttr, blockProps) }}
			cls={`rw-blocks-slideshow alignfull ${theme ?? ''}`}
			cb={v => !/^((wp-block-rw-blocks-\w+)| (w*(-blocks - slideshow)))$/.test(v)}
			css={sldCss}
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
function Slide({ attributes: a, edit }) {
	const ob = (i, v) => ({ cls: "slide" + i, attr: a[`sld${v}Attr`], css: a[`sld${v}Css`] });
	return (
		<Cel {...ob('', '')}>
			<Cel {...ob('-content', 'Ar')}>
				{edit ? <InnerBlocks /> : <InnerBlocks.Content />}
			</Cel>
		</Cel>
	);
}

function Cel({ attr = {}, cls = '', cb, css = {}, children, more = {} }) {
	const ta = (a, b, c) => {
		const d = b?.className?.split(/\s+/g);
		return mergeCls(a, typeof c == 'function' && Array.isArray(d) ? d?.filter(c) : c);
	};
	return <div {...attr} className={ta(cls, attr, cb).trim()} style={css} {...more}>{children}</div>;
}
//======================================
export { Slideshow, Slide, arrows, sldObjNm };
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
};
