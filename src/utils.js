function c_h(str, toCamel) {
	return toCamel ?
		str.replace(/-./g, match => match.charAt(1).toUpperCase()) :
		str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
function nested(obj, path, v, act) {
	const ps = path.split('.');
	const l = ps.pop();
	const tgt = ps.reduce((o, k) => o[k] = o[k] ?? {}, obj);
	if (act === 'set') tgt[l] = v;
	else if (act === 'rm' && tgt && tgt.hasOwnProperty(l))
		delete tgt[l];
	else return tgt[l];
}
const addLinkStyle = (href, id) => {
	_c(document.head).append("link", { id, href, rel: "stylesheet" });
};
function rgx(s, v) { return new RegExp(`^(${s})$`).test(v); }
export { c_h, nested, addLinkStyle, rgx };