import { InspectorControls, InnerBlocks, RichText, useBlockProps, } from '@wordpress/block-editor';
import { TextControl, Button } from '@wordpress/components';
import { useState, useEffect, createElement } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { c_h, nested, addLinkStyle, rgx } from './utils';

const SetKeyVals = ({ attributes: attr, setAttributes: sattr, attributeKey: aKey, isCss = !!1 }) => {
	const isN = /\./.test(aKey);
	const [pairs, setPairs] = useState(Object.entries(isN ? nested(attr, aKey) : attr[aKey] || {}));
	useEffect(() => { setPairs(Object.entries(isN ? nested(attr, aKey) : attr[aKey] || {})); }, [aKey, attr]);
	const upAttr = np => {
		setPairs(np);
		const nAttr = np.reduce((acc, [k, v]) => {
			if (k) acc[isCss && !k.startsWith('--') ? c_h(k, 1) : k] = v;
			return acc;
		}, {});
		sattr({ [aKey]: nAttr });
	};
	const add = () => setPairs([...pairs, ['', '']]);
	const update = (idx, k, v) => {
		const np = [...pairs];
		np[idx] = [k, v];
		upAttr(np);
	};
	const remove = (idx) => {
		const np = [...pairs];
		np.splice(idx, 1);
		upAttr(np);
	};
	return (
		<div>
			{pairs.map(
				([key, val], idx) => (
					<div key={idx}>
						{
							["Property", "Value"].map((v, i) => (
								<TextControl
									label={v}
									value={i ? val : key}
									onChange={nv => update(idx, i ? key : nv, i ? nv : val)}
								/>
							))
						}
						<Button isDestructive onClick={() => remove(idx)}>Remove</Button>
					</div>
				)
			)}
			<Button primary onClick={add}>Add Property</Button>
		</div>
	);
};
/**
 * Custom hook to query blocks similar to querySelectorAll.
 * @param {string} blockName - The name of the block to query.
 * @param {string} parentClientId - The client ID of the parent block (optional).
 * @returns {Array} - An array of blocks matching the query.
 */
const useQueryBlocks = (blockName, parentClientId = null) => {
	return useSelect((select) => {
		const { getBlocks } = select('core/block-editor');

		let blocks = parentClientId ? getBlocks(parentClientId) : getBlocks();

		// Filter blocks by name
		return blocks.filter(block => block.name === blockName);
	}, [blockName, parentClientId]);
};
const queryBlocksNm = (blkNm, clientId) => {
	return useSelect((select) => {
		const { getBlocksByName } = select('core/block-editor');
		return clientId ? getBlocksByName(blkNm, clientId) : 0;
	}, [blkNm, clientId]);
};
class ErrorBoundary extends React.Component {
	constructor(props) { super(props); this.state = { hasError: false }; }
	static getDerivedStateFromError(error) { // Update state so the next render will show the fallback UI.
		return { hasError: true };
	} componentDidCatch(error, errorInfo) {
		// You can also log the error to an error reporting service
		console.log("ErrorBoundary caught an error", error, errorInfo);
	}
	render() {
		if (this.state.hasError) { // You can render any custom fallback UI
			return <h1>Something went wrong.</h1>;
		}
		return this.props.children;
	}
}
// Usage example in a component
const MyComponent = ({ clientId }) => {
	// Query all child blocks named 'my-plugin/child-block' within the parent block
	const childBlocks = useQueryBlocks('my-plugin/child-block', clientId);

	return (
		<div>
			<p>Parent Block ID: {clientId}</p>
			{childBlocks.map(block => (
				<div key={block.clientId}>
					{/* Render child block attributes or content */}
					{JSON.stringify(block.attributes)}
				</div>
			))}
		</div>
	);
};

const mergeObj = (props, extra) => { return Object.assign({}, props, extra); };
const mergeCls = (base, extra) => { return [...base.split(/\s+/g), ...extra].join(" "); };

function Cel({ el = 'div', attr = {}, cls = '', cb, css = {}, children, more = {} }) {
	const ta = (a, b, c) => {
		const d = b?.className?.split(/\s+/g);
		return mergeCls(a, Array.isArray(d) ? (typeof cb == 'function' ? d?.filter(cb) : d) : []);
	};
	const cs = el?.indexOf('-') ?? -1;

	const fn = {
		...attr,
		['class' + (cs > -1 ? '' : 'Name')]: ta(cls, attr).trim(),
		...(Object.keys(css).length ? { style: css } : css),
		...more,
	};
	if (cs > -1) {
		//__o.log(el, more, attr, cls);
		delete fn.className;
	}
	//__o.log(fn, attr, ['class' + (cs > -1 ? '' : 'Name')], cls?.split(/\s+/g).concat(attr?.className?.split(/\s+/g)).join(" "), ta(cls, attr).trim());
	return createElement(el, fn, children);
}

function OptI({ children }) {
	return <InspectorControls>
		<div style={{ padding: "0 1.3em" }}>{children}</div>
	</InspectorControls>;

}

export {
	c_h, nested, addLinkStyle,
	mergeCls, mergeObj,
	useQueryBlocks, queryBlocksNm, ErrorBoundary,
	SetKeyVals, Cel, OptI, rgx
};
