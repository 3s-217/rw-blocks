const { gTasks } = require("gulp_bld"),
	{ mk, nd } = gTasks,
	_as = p => (`./build/${p ? p : ''}`),
	_dn = (dest, nm) => nd(nm, dest);
const Tasks = {
	CSS: {
		sass: {
			type: "sass",
			files: ["./src/**/css/**/*.scss"],
			clean: _dn(_as()),
			min: _dn(_as()),
			wat: !!1
		}
	}
};
Object.entries(Tasks).forEach(([k, v]) => mk(v, k));
