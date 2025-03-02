
import { registerBlockType, registerBlockCategory } from '@wordpress/blocks';

// Register a custom category
const customCategory = {
	slug: 'rw-blocks-category',
	title: 'RW Blocks',
	icon: 'heart'
};

wp.blocks.updateCategory(customCategory.slug, {
	title: customCategory.title,
	icon: customCategory.icon,
});

// Then, register your blocks
import './slideshow';
import './slide';
import './world-map';
await fetch(location.origin + "/wp-content/uploads/2024/12/world-3.svg")
	.then(async r => {
		const { mkEl: e, mknode: n } = __o;
		let f = e("iframe.alignfull", { border: '0' });
		let l = e('div', { html: await r.text() });
		let svg = _c(n(l)).qy('svg');
		svg.attr('width', '100%');
		_c(f).frame({ el: "body" }).append(svg.gt);
		_c("body").append(f);
		__o.log(svg.attr());
	});

async function svgiFrame({ el, url, cb, frm, css, ext }) {
	const res = await fetch(url);
	const { mkEl: e, mknode: n } = __o;
	let f = n(e("iframe", frm));
	let l = e('div', { html: await res.text() });
	let cs = e("style", { html: css });
	let svg = _c(n(l)).qy('svg').attr({ width: '100%', height: '100%' });
	const pth = svg.all("path");
	const map = new Map();
	const ar = ['class', 'name'];
	for (let p of pth) {
		let a = _c(p).nattr(ar), [b, c] = ar;
		if (map.has(a[b]) || map.has(a[c])) continue;
		map.set(a[b] ?? a[c], a[b] ? b : c);
		if (a[b] && a[c]) __o.log(a);
	}
	_c(f).on("load", (y) => {
		_c(f).frame({ el: "body" }).append(n(cs)).append(svg.gt);
	})._(el).append(f);
	return { total: pth.length, unq: map.size, map, svg: svg.gt, frm: f, ext };
}
function confSvg(main, dt) {
	const { map, svg, ext } = main;
	if (!__o.utils.type(dt, 'obj')) throw new Error("data needs to be objects");
	const m = Array.from(map.keys());
	Object.entries(dt).forEach(([k, v]) => {
		let a = m.filter(n => new RegExp(`^(${k})$`, 'i').test(n))[0];
		_c(svg).all(`path[${map.get(a)}="${a}"]`)
			.forEach(w => v.css ? _c(w).css(v.css) : 0);
	});
	if (ext)
		main.exp = {}, map.keys().reduce((acc, v) => {
			let color = Math.round(Math.random() * 0xFF0000);//0xFFFFFF
			let fill = '#' + color.toString(16).padStart(6, '0');
			return acc[v] = { css: { fill }, pop: {}, attr: {} }, acc;
		}, main.exp);
	window.wpm = main;
}
confSvg(await svgiFrame({
	url: location.origin + "/wp-content/uploads/2024/12/world-3.svg",
	el: "#wfrm",//"body .wp-block-post-content"
	frm: { style: 'border: 0; width:calc(100% - 20px); height:100vh', class: "alignfull" },
	css: `*{margin:0;}body{position:absolute;width:100%;height:100%;} path[style]{filter: drop-shadow(0px 0px 5px grey);}`,
	ext: 1
}), {}); "rgba(255,255,255,1)"
//wpm.map.keys().reduce((acc, v) => { return acc[v] = { css: {}, pop: {} }, acc; }, {});
