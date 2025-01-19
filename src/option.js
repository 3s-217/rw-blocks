import { TextControl, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

const DynamicKeyValuePair = ({ attributes, setAttributes: sattr, attributeKey: attrKey, isStyle = false }) => {
	const [pairs, setPairs] = useState(Object.entries(attributes[attrKey] || {}));
	const addPair = () => setPairs([...pairs, ['', '']]);
	const updatePair = (idx, key, val) => {
		const newPairs = [...pairs]; newPairs[idx] = [key, val];
		setPairs(newPairs);
		const nAttr = newPairs.reduce((acc, [k, v]) => {
			if (k) {
				if (isStyle) {
					acc[k] = v;
				} else { acc[k] = v; }
			} return acc;
		}, {});
		sattr({ [attrKey]: nAttr });
	};
	const removePair = (index) => {
		const newPairs = [...pairs];
		newPairs.splice(index, 1); setPairs(newPairs);
		const nAttr = newPairs.reduce((acc, [k, v]) => {
			if (k) {
				if (isStyle) {
					acc[k] = v;
				} else { acc[k] = v; }
			} return acc;
		}, {});
		sattr({ [attrKey]: nAttr });
	};
	return (
		<div> {
			pairs.map(([key, val], idx) => (
				<div key={idx} >
					<TextControl
						label="Property"
						value={key}
						onChange={(nProp) => updatePair(idx, nProp, val)}
					/>
					<TextControl
						label="Value"
						value={val}
						onChange={(nVal) => updatePair(idx, key, nVal)}
					/>
					<Button isDestructive onClick={() => removePair(idx)}>Remove</Button>
				</div>
			))}
			<Button primary onClick={addPair}>Add Property</Button>
		</div>
	);
};

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
const addLinkStyle = (href, id) => {
	_c(document.head).append("link", { id, href, rel: "stylesheet" });
};
function nested(obj, path, v, act) {
	const ps = path.split('.');
	const l = ps.pop();
	const tgt = ps.reduce((o, k) => o[k] = o[k] ?? {}, obj);
	if (act === 'set') tgt[l] = v;
	else if (act === 'rm' && tgt && tgt.hasOwnProperty(l))
		delete tgt[l];
	else return tgt[l];
}
function c_h(str, toCamel) {
	return toCamel ?
		str.replace(/-./g, match => match.charAt(1).toUpperCase()) :
		str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
export { DynamicKeyValuePair, useQueryBlocks, addLinkStyle, nested, SetKeyVals, queryBlocksNm, ErrorBoundary };
