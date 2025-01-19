/* eslint-disable no-console */
if (typeof _ui == "undefined") _ui = {};
/* class rwSlides {
	static len = 0;
	static shows = {};
	constructor(rt, idx) {
		this.rt = rt;
		this.idx = idx;
		this.dot = _c(rt).qy(".timeline-dots").gt;
		this.mv = {
			n: _c(rt).qy(".next").on('click', this.next.bind(this)).gt,
			p: _c(rt).qy(".prev").on('click', this.prev.bind(this)).gt
		};
		this.dots();
		if (rwSlides.shows[idx])
			this.anima(!!0),
				delete rwSlides.shows[idx];
		rwSlides.shows[idx] = this;
		_c(this.dot).on("click", this.#click.bind(this));
	}
	next() {
		const { cur: { idx: i }, sld: s, rpt, tmr } = this;
		if (i == s.length - 1 && !rpt) return (tmr) ? this.anima() : 0;
		this.goto((i < s.length - 1) ? i + 1 : 0);
	}
	prev() {
		const { cur: { idx: i }, sld: s, rpt } = this;
		if (!i && !rpt) return;
		this.goto((!i ? s.length : i) - 1);
	}
	#click(ev) {
		const t = ev.target,
			c = i => t.classList.contains(i);
		if (!c('dot')) return;
		if (c("act")) return;
		const d = this.dot.children;
		for (let e = 0; e < d.length; e++)
			if (d[e] == t)
				return this.goto(e);
	}
	goto(idx) {
		const { sld: s, cur: { el: l, idx: i }, dot: { children: c } } = this, rm = { add: 'act', remove: "done" },
			up = (e, j, o) => e._(c[j]).class(o)._(s[j]).class("remove", "act");
		if (i != idx && idx > -1 && idx < s.length) {
			if (i >= idx + 1) _c(l).class("add", 'bk');
			const r = { el: s[idx], idx },
				e = _c(r.el)
					.class("add", ...[i >= idx + 1 && s.length - 1 >= idx + 1 ? 'bk' : 0, 'act'].filter(v => (v)))
					.class({ remove: "done" })
					._(c[idx]).class(rm);
			for (let j = 0; j < idx; j++) up(e, j, { add: 'done', remove: "act" }).class("add", 'done');
			for (let j = idx + 1; j < s.length; j++) up(e, j, { remove: ["act", 'done'] });// .class("add", 'bk')
			this.cur = r;
		};
	}
	anima(act, tm = 5e3) {
		if (this.tmr) clearInterval(this.tmr), this.tmr = null;
		if (!act) return;
		this.tmr = setInterval(this.next.bind(this), this.tm = tm);
	}
	dots() {
		const { rt, dot: { children: d } } = this,
			s = _c(rt).qy(".slide").gt.parentNode.children,
			n = __o.mknode(__o.mkEl('.dot', {})), f = [];
		__o.log(s);
		_c(s[0].parentNode)
			.on("animationend", e => __o.log(e))
			.on("transitionend", e => {
				var a = e.target.classList;
				if (a.contains('act', 'done'))
					a.remove("done");
				if (a.contains('bk'))
					a.remove("bk");
			});
		if (d.length < s.length) {
			for (let y = 0; y < s.length - d.length; y++)
				f.push(n.cloneNode());
			this.dot.append(...f);
		}
		else if (d.length > s.length)
			for (let y = s.length; y < d.length; y++)
				d[y].remove();
		for (let y = 0; y < s.length; y++) {
			if (_c(s[y]).class().contains('act')) this.cur = { idx: y, el: s[y] };
		}
		if (!this.cur) {
			this.cur = { idx: 0, el: s[0] };
			_c(s[0]).class("add", 'act');
		}
		this.sld = s;

	}
	static init() {
		const tln = _c(document).all(".timeline-section");
		rwSlides.len = tln.length;
		for (let j = 0; j < tln.length; j++) new rwSlides(tln[j], j);
		console.log("slideshow");
	}
}
_c(document).on("DOMContentLoaded", rwSlides.init);
_ui.rwSlides = rwSlides; */
/* eslint-enable no-console */

(`
.rw-blocks-slideshow
 .slides-area // check for transition or animation
   .slide: .slide-content
 .slide-ctrl
   .slide-mv // check for children
    .next
    .prev
   .slide-dots
    .dot
	input(type="range" max="slide-count" min="0" steps="1")
`);

const dcf = {
	h: "100%",
	w: "100%",
	gu: 1,
	th: ["loop-js", 'loop', "once", "ftbk"],
	dot: "div" || "in" || 0,
	lp: 0,
	an: 0,
	dur: 5e3,
	css: {
		slideSection: {},
		slidesArea: {},
		slide: {},
		slideContent: {},
		slideCtrl: {},
		slideMv: {},
		next: {},
		prev: {},
		slideDots: {},
		slideDot: {}
	},
	nxt: "<",
	prv: ">",
	act: { f: "done", a: "act", r: "bk" }
};
const { utils: { type: utype }, log } = __o;
class slideBox {
	static len = 0;
	static shows = {};
	#astop = 0; #tmr = 0;
	get astop() { return this.#astop; }
	constructor(rt, idx) {
		this.rt = rt;
		this.idx = idx;
		let o = _c(rt);
		this.attr = o.nattr(["sldcf", "theme", "anima", 'tm', 'lp', 'control', 'class']);
		setCf(this);
		//
		let f = this.attr;
		if (slideBox.shows[idx] && !slideBox.shows[idx]?.rt.isSameNode(rt)) {
			this.anima(!!0), delete slideBox.shows[idx];
		};
		slideBox.shows[idx] = this;

		if (f.tm) rt.style.setProperty("--sld-da", f.tm + 's');

		const p = _c(rt).qy(".slide").gt?.parentNode,
			s = p?.children;
		if (s && !this.cur) {
			this.cur = { idx: 0, el: s[0] };
			_c(s[0]).class("add", "act");
			this.Anima = { a: hasAnima(s[0]) };
		}
		p.sbx = this;
		this.sld = s;
		this.dot = o.qy(".slide-dots").gt;
		//__o.log(this.attr, !f.control && f.control != '' ? 'em' : 'ex');
		if ((f.control || __o.utils.type(f?.control, 'str')) && this.cf.gu) {
			__o.utils.type(f?.control, 'emp') ? f.control = !!1 : 1;
			['next', 'prev'].forEach(v => {
				let a = _c(rt).qy('.' + v);
				if (a.gt.children.length)
					a.on("click", this[v].bind(this));
			});
			this.dots();
			_c(this.dot).on("click", this.#click.bind(this));
		}
		f.class = f.class.split(" ");
		if (f.class.includes("inf-h") || f.class.includes("inf-v")) {
			f.theme = f.class.filter(v => rgx('inf-[vh]', v))[0];
			//__o.log(rgx('inf-h', f.theme), rgx('inf-v', f.theme));
			if (rgx('inf-h', f.theme)) {
				if (p.scrollLeft <= _o.hw().w) {
					let n = [];
					for (let a of s)
						n.push(a.cloneNode(!!1));
					if (n.length == 1) n.push(n[0].cloneNode(!!1));
					p.append(...n);
				}
				calcMLeft(s[0], s[1]);
			}
			this.anima(1);
		}

	}
	next(e) {
		const {
			cur: { idx: i }, sld: s, attr: { lp }, idx
		} = this;
		if (i == s.length - 1 && __o.utils.type(lp, 'unu')) return (this.#tmr ? this.anima() : 0);
		this.goto(i < s.length - 1 ? i + 1 : 0);
	}
	prev() {
		const {
			cur: { idx: i },
			sld: s,
			attr: { lp },
		} = this;
		if (!i && __o.utils.type(lp, 'unu')) return this.#tmr ? this.anima() : 0;
		this.goto(!i ? s.length - 1 : i - 1);
	}
	goto(idx) {
		//! need to change for non gui
		const {
			sld: s,
			cur: { el: l },
			cf: { act }
		} = this,
			i = Array.from(s).findIndex(v => v.isSameNode(l));
		idx = parseInt(idx);
		if (i != idx && idx > -1 && idx < s.length) {
			const r = this.cur = { el: s[idx], idx };
			const up = this.#update.bind(this);
			const bk = i >= idx + 1 && s.length - 1 >= idx + 1;
			//==
			if (i > idx) _c(l).class("add", act.r);
			//==
			//todo: need to handle rpt reveser bk class logic correctly
			for (let j = 0; j < idx; j++)
				if (!_c(s[j]).class().contains("done"))
					up(j, { add: act.f, remove: [act.a, act.r] });
			//==
			let fn = {
				add: [act.a, bk ? act.r : 0].filter(v => v),
				remove: [act.f, bk ? 0 : act.r].filter(v => v)
			};
			log(i, idx);
			up(idx, fn);
			//==
			for (let j = idx + 1; j < s.length; j++)
				if (!s[j].isSameNode(r.el))
					up(j, { remove: [act.a, act.f, !bk ? act.r : 0].filter(v => v) });
		}
	}
	#click(ev) {
		const t = ev.target,
			c = i => t.classList.contains(i);
		if (!c('dot')) return;
		if (c("act")) return;
		const d = this.dot.children;
		for (let e = 0; e < d.length; e++)
			if (d[e] == t)
				return this.goto(e);
	}
	static init() {
		const tln = _c(document).all(".rw-blocks-slideshow");
		slideBox.len = tln.length;
		for (let j = 0; j < tln.length; j++) new slideBox(tln[j], j);
	}
	anima(act, tm) {
		const { attr: { theme }, sld } = this;
		if (/(icon|(inf-[hv]))/.test(theme)) {
			if (act) {
				_c(sld[0].parentNode).on("transitionend", iconAinma);
				this.goto(1); //: 0;
			}
			else this.#astop = 1;
		}
		else {
			if (this.#tmr) clearInterval(this.#tmr), this.#tmr = null;
			if (!act) return;
			this.#tmr = setInterval(this.next.bind(this), this.tm = tm);
		}
	}
	#update = updateBoth.bind(this);
	//! problem with non gui logic and init logic
	dots() {
		const { dot: { children: d }, sld: s } = this,
			n = __o.mknode(__o.mkEl(".dot", {})),
			f = 'length', l = i => i[f];
		if (!s) return;
		if (l(d) < l(s))
			this.dot.append(...Array.from({ [f]: (l(s) - l(d)) }, () => n.cloneNode()));
		else if (l(d) > l(s))
			for (let y = l(s); y < l(d); y++) d[y].remove();
		for (let y = 0; y < l(s); y++) {
			if (_c(s[y]).class().contains("act")) {
				this.cur = { idx: y, el: s[y] };
				_c(d[y]).class("add", "act");
			}
		}
		if (!this.cur) {
			this.cur = { idx: 0, el: s[0] };
			this.#update(0, { add: "act" });
		}
	}
}
//* refined
function hasAnima(el) {
	const t = utype;
	const a = t(el, 'inst', __o) ? el : _c(el);
	const [an, tr] = ['anima', 'transi'].map(v => a.gcs(null, v + 'tion'));
	return { anima: !t(an, 'emp'), trans: !t(tr, 'emp') };
}
function updateBoth(i, act) {
	const { sld: s, dot: { children: d }, attr: { control: c } } = this;
	const o = _c(s[i]).class(act);
	if (c)
		o._(d[i]).class(act);
}
//* refined
function setCf(inst) {
	const { attr: a, rt } = inst;
	inst.cf = a.sldcf ? _c(a.sldcf).json("p") ?? {} : {};
	let igr = ["h", "w", "css"];
	for (let [k, v] of Object.entries(dcf)) {
		if (!Object.hasOwn(inst.cf, k) && !igr.includes(k)) {
			inst.cf[k] = v;
		}
	}

}
function setup(inst) {
	function t1() { }
	function t2() { }
	function t3() { }
	function t4() { }
}
function setCss(el, obj) {
	if (utype(obj, 'obj')) {
		__o.each(obj, 'e', ([k, v]) => el.style.setProperty(`--${(c_h(k))}`, v));
	} else
		el.style.setProperty("--sld-da", f.tm + 's');
}
function rgx(s, v) { return new RegExp(`^(${s})$`).test(v); }
function c_h(str, toCamel) {
	return toCamel ?
		str.replace(/-./g, match => match.charAt(1).toUpperCase()) :
		str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
function iconAinma(e) {
	let t = e.target;
	if (!t.classList.contains('slide')) return;
	const { attr, astop, cur, sld: s, ani } = this.sbx;
	if (attr.theme == "inf-h") {
		t.parentNode.append(t);
		_c(t).class('remove', 'done');
		!astop ?
			this.sbx.goto(1) : _c(this).off("transitionend", iconAinma);
	} else {
		var a, b;
		!astop && e.propertyName == "margin-top" ?
			a = this.sbx[b = (cur.idx == s.length - 1) ? 'goto' : 'next'] : 0;
		if (a)
			setTimeout(a.bind(this.sbx, 0), e.elapsedTime * 1e3);
	}
}
function calcMLeft(cur, nxt, tar = '--sld-dml') {
	const { left: l } = _c(nxt).rect;
	const c = _c(cur);
	const cs = c.gcs(null, 'marginLeft');
	const ml = parseFloat(cs) || 0;
	const d = l - ml - 40;
	cur.parentNode.style.setProperty(tar, `-${d}px`);
}

_c(document).on("DOMContentLoaded", slideBox.init);
_ui.slideBox = slideBox;

