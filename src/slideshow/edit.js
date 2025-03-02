import { InspectorControls, InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
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
import { useState, useEffect, useRef } from '@wordpress/element';
//======================================
import { Slideshow, Slide, arrows, sldObjNm } from './main';
import { DynamicKeyValuePair, useQueryBlocks, addLinkStyle, nested, SetKeyVals, OptI } from '../option';
import conf from './config.json';
const sldtypes = new Map();
conf.themes.map(v => sldtypes.set(v.nm, (v.pt = v.pt.split("/")[1].split(".")[0], v)));
//======================================
//* Main editor options
function BlkOpt(props) {
	const { attributes: a, setAttributes: sattr, parentIndex: pi, parentNode: pn, slideCount: s } = props;
	const [btn, setBtn] = useState("l");
	useEffect(() => {
		var s = props.name.split("/");
		if (__o.utils.type(a.theme, 'emp')) return;
		var c = props.name.replace("/", '-') + '-' + a.theme;
		if (!_c('#' + c).gt)
			addLinkStyle(`/wp-content/plugins/${s[0]}/build/${s[1]}/css/${a.theme}.css`, c);
		let bt = Object.entries(arrows).reduce((acc, [k, v]) => {
			let t = (a.nextBtn ?? a.prevBtn);
			if (t.l == v.l && t.u == v.u && t.r == v.r && t.d == v.d)
				acc = k;
			return acc;
		}, "");
		setBtn(bt);
	});
	const ext = (t, n, k = '') => ({ title: t, name: n, sattr, attr: a, ky: k });
	return (
		<OptI>
			<p>parentId {pi}</p>
			<p>slideCount {s}</p>
			<hr />
			<SelectControl
				label="Slideshow layouts"
				value={a.theme}
				options={Array.from(sldtypes).map(([k, v]) => ({ label: v.nm, value: v.pt }))}
				onChange={v => sattr({ theme: v, sldAttr: { ...a.sldAttr, theme: v } })}
			/>
			<div className='flex-opt'>
				<ToggleControl
					label="GUI"
					checked={!!a.gui}
					onChange={(v) => sattr({ gui: v ? 1 : 0 })}
					__nextHasNoMarginBottom={!!1}
				/>
				<div style={{
					display: 'flex', alignItems: ' stretch',
					justifyContent: 'center',
				}}>
					<span style={{ marginRight: '1em' }}>LR</span>
					<ToggleControl
						label="UD"
						checked={a.btnIco == 'ud'}
						onChange={(v) => sattr({ btnIco: v ? 'ud' : 'lr' })}
					/>
				</div>
			</div>
			{a.gui ? <SelectControl
				label="Slideshow Arrow"
				value={btn}
				options={Object.entries(arrows).map(ar => ({ label: Object.values(ar[1]).join(" "), value: ar[0], id: ar[0] }))}
				onChange={(v, e) => (setBtn(v), sattr({ nextBtn: arrows[v], prevBtn: arrows[v] }))}
			/> : <></>}
			<hr />
			<div className='flex-opt'>
				{
					['run', 'lp'].map(e => (
						<ToggleControl
							label={e == 'lp' ? 'loop' : "animation"}
							checked={a.anima[e] ? 1 : 0}
							onChange={(v) => (sattr({ anima: { ...a.anima, [e]: v ? 1 : 0 } }))}
						/>
					))
				}
			</div>
			<TextControl
				label="Duration per slide (sec)"
				value={a.anima.tm || ''}
				placeholder='default'
				type="number"
				onChange={(v) => sattr({ anima: { ...a.anima, tm: v } })}
			/>
			<Optcmts {...props} />
			<PanelBody initialOpen={!!0} title="Styling">
				<TabPanel tabs={[
					{ title: 'slide show', name: 'show', css: "" },
					{ title: 'slides area', name: 'area', css: "a" },
					{ title: 'slide', name: 'slide', css: "b" },
					{ title: 'slide content', name: 'content', css: "c" },
					{ title: 'slide ctrl', name: 'ctrl', css: "z" }
				]}
					children={tab => {
						const f = i => (tab.css == "" ? i : `--sld-${tab.css}${i[0]}`);
						return <div>
							<div style={{
								fontWeight: 'bold',
								textTransform: 'uppercase',
								margin: '11px 0 0 0',
								fontSize: '12px}'
							}}>{tab.title} </div>
							<div>Make sure to add the units</div>
							<hr />
							{['height', 'width'].map(d => <TextControl
								label={d}
								value={a.sldCss[f(d)] ?? ''}
								placeholder='default'
								onChange={v => sattr({ sldCss: { ...a.sldCss, [f(d)]: v } })}
							/>)}
						</div>;
					}} />
			</PanelBody>
			<ExtAdv tabs={[
				...[
					['slide-show', 'slide'],
					['slides-area', 'area', 'Ar'],
					['slide-ctrl', 'ctrl', 'Ctrl'],
					['slide-mv', 'mv-area', 'Mv'],
					['next', 'next', 'Nxt'],
					['prev', 'prev', 'Prv'],
					['slide-dots', 'dots-area', 'Dots']
				].map(v => ext(...v))
			]} />
			<PanelBody initialOpen={!!0} title="Import json block config">
				<TextControl label="json config/props" onChange={v => sattr({ ijson: v })} />
				<i style={{ color: "red", marginBottom: '1.3em' }}>
					will override
				</i>
				<Button style={{ border: "1px black solid" }} onClick={() => a.ijson.length ? importBlockConf(a.ijson, props) : 0}>
					Import Json Props
				</Button>
			</PanelBody>
			<PanelImEx attr={a} />

		</OptI>
	);
}
//* Slide editor options
function SldOpt(props) {
	const { attributes: a, setAttributes: sattr,
		prtIdx: pi, prtNode: pn, sldCnt: s, sldIdx: ssi } = props;
	const [view, setView] = useState({ sld: !!0, sldAr: !!0 });
	const ext = (t, n, k = '') => ({ title: t, name: n, sattr, attr: a, ky: k });
	return (
		<>
			<OptI>
				<p>slideshowIdx: {pi}</p>
				<p>sldIdx: {ssi}</p>
				<p>slideCount: {s}</p>
				<hr />
				<ToggleControl
					label="Contents as text"
					checked={a.txt}
					onChange={(v) => sattr({ txt: !!v })}
				//disabled={a?.pure}
				/>
				<div style={{ display: "block" }}>
					<p>Base Background</p>
					{[
						["", "", view.sld],
						[" Content", "Ar", view.sldAr]
					].map(v => <OptColor
						attributes={a}
						setAttributes={sattr}
						title={"Slide" + v[0]}
						rtKey={`sld${v[1]}Css`}
						skey="background"
						show={i => setView({ ...view, [`sld${v[1]}`]: !!(v[2] ? 0 : 1) })}
						view={v[2]}
					/>
					)}
				</div>
				<Optcmts {...props} />
				<ExtAdv tabs={[
					['slide', 'slide'],
					['content', 'content', 'Ar']
				].map(v => ext(...v))} />
				<PanelImEx attr={a} />
			</OptI>
			<Slide {...props} edit={!!1} />
		</>
	);
}
function SldTxtOpt(props) {
	const { attributes: a, setAttributes: sattr } = props;
	const ext = (t, n) => ({ title: t, name: n, sattr, attr: a, key: 1 });
	return (
		<OptI>
			<TextControl
				label="type"
				value={a.type.length ? a.type : ''}
				placeholder='div'
				type="text"
				onChange={(v) => {
					!__o.utils.type(Number(v), 'num') ?
						(__o.log('what is this ', v, __o.utils.type(v, 'num')),
							sattr({ type: v })) :
						0;
				}}
			/>
			<Optcmts {...props} />
			<PanelImEx attr={a} />
			<ExtAdv tabs={[ext('sldshw-txt', 'slideshw')]} />
		</OptI>
	);
}
function RwAnyOpt(props, ...args) {
	const { attributes: a, setAttributes: sattr } = props;
	const ext = (t, n) => ({ title: t, name: n, sattr, attr: a, key: ['css', 'attr'] });
	return (
		<OptI>
			<br />
			<p style={{ color: "red" }}>
				<strong>Use or Edit this block only if you know what you are doing</strong>
				<br />
				<hr />
			</p>
			<p>
				If <strong><i>script or style</i> is el type there are no safe guards</strong>
			</p>
			<TextControl
				label="type"
				value={a.type}
				placeholder='div'
				type="text"
				onChange={v => {
					!__o.utils.type(Number(v), 'num') || !v.length ?
						sattr({ type: v }) : 0;
				}}
				disabled={a.pure}
			/>
			<hr />
			<p>If <strong><i>Contents as text</i> is enabled </strong>
				it will wrap contents in html tags using the provided type
				<br />
				<hr />
			</p>
			<ToggleControl
				label="Contents as text"
				checked={a.txt}
				onChange={(v) => sattr({ txt: !!v })}
				disabled={a.pure}
			/>
			<hr />
			<p>If <strong><i>just text</i> is enabled </strong>
				it returns only text without any html tag
				wp logic will auto add <i>newline</i> before and after text
				<br />
				<hr />
			</p>
			<ToggleControl
				label="Just text"
				checked={a.pure}
				onChange={(v) => sattr({ pure: !!v, txt: v ? !!1 : a.txt })}
			/>
			<hr />
			<Optcmts {...props} />
			<PanelImEx attr={a} />
			<ExtAdv tabs={[ext('Element', 'Element')]} />
		</OptI>
	);
}
//======================================
export { BlkOpt, SldOpt, SldTxtOpt, RwAnyOpt };
//======================================
function PanelImEx(props) {
	const { attr: a, sattr } = props;
	return <PanelBody initialOpen={!!0} title="Log props to console">
		<div style={{ width: "100%", textAlign: "center" }}>
			{[
				["props to console", "object", () => console.log(a)],
				["props as json", "json", () => console.log(JSON.stringify(a))]
			].map(v => <Button name={"Print " + v[0]}
				onClick={v[2]}
				style={{ width: '50%', justifyContent: 'center', border: "1px black solid" }}>
				{v[1]}
			</Button>)
			}
		</div>
	</PanelBody>;
}
function importBlockConf(json, props) {
	const { setAttributes: s } = props;
	let pr;
	try {
		pr = JSON.parse(json);
		s({ ...pr });
	}
	catch (e) { console.log("Not a valid json", e); }
}
function ImportExport() { }
//* components groups
function OptColor({ attributes: a, setAttributes: sattr, rtKey, skey, show, title, view }) {
	//const [view, setView] = useState({ sld: !!0, sldAr: !!0 });
	const set = v => sattr({ [rtKey]: { ...a[rtKey], [skey]: v } });
	const rm = v => (
		delete a[rtKey][skey],
		sattr({ [rtKey]: { ...a[rtKey] } })
	);
	const bt = { border: ' 1px solid black', margin: '0px auto', alignItems: 'stretch' };
	return (
		<>
			<Button onClick={show} style={bt}>
				<ColorIndicator colorValue={a[rtKey][skey] ?? ""}></ColorIndicator>
				<div style={{ marginLeft: '6px' }}>{title}</div>
			</Button>
			{view && <Popover onFocusOutside={show}>
				<TabPanel tabs={[
					{ title: 'solid', name: 'slide' },
					{ title: 'gradient', name: 'content' }
				]} children={({ name }) => {
					return (
						<PanelBody>
							{name == 'slide' ?
								<ColorPicker enableAlpha={!!1}
									style={{ height: "fit-content" }}
									onChange={set}
								/> :
								<GradientPicker
									onChange={set}
									value={/^(l|r)/.test(a[rtKey][skey] ?? "") ? a[rtKey][skey] : null}
								/>
							}
						</PanelBody>
					);
				}}>
				</TabPanel>
				<Button onClick={rm} style={{ ...bt }}>remove</Button>
			</Popover >}
		</>
	);
}
//==============
function Optcmts({ attributes: a, setAttributes: sattr }) {
	return <PanelBody initialOpen={!!0} title="Comments">
		<div style={{
			background: '#ededed',
			padding: '11px',
			borderRadius: "7px"
		}}>
			<RichText
				onChange={v => sattr({ cmt: v })}
				value={a.cmt}
				placeholder='user/block comments' />
		</div>
	</PanelBody>;
}
//* Extreme adv Tabpanel El
function ExtAdv({ tabs }) {
	return <PanelBody initialOpen={!!0} title="Exterme Adv.">
		<p style={{ color: 'red' }}>
			You have access to
			<strong> add|remove </strong>
			any react prop procced with caution
		</p>
		<TabPanel tabs={tabs} children={exTabs} />
	</PanelBody>;
}
function exTabs({ name, title, attr, sattr, ky = "", key }) {
	return (
		<Panel>
			{
				[
					["Styles", "Set css using JS Api name", "Css"],
					["Attributes", "!! Set React props there is no safeguard !!", "Attr"]
				].map((v, i) => (
					<PanelBody title={v[0]} initialOpen={!!0} key={i}>
						<div style={{ color: 'red' }}>{v[1]}</div>
						<br />
						<SetKeyVals
							attributes={attr}
							setAttributes={sattr}
							attributeKey={key ? key[i] : `sld${ky}${v[2]}`}
							isCss={i == 0}
						/>
					</PanelBody>
				))
			}
		</Panel>
	);
}
(<div class='rwAny'>
	<wp-core-blocks></wp-core-blocks>
	<span class='rwAny'>test</span>
	{/* text generated by another rwAny attr.pure=true*/}
	plain RichText
</div>);
