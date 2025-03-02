if (typeof _ui == "undefined") _ui = {};
const { utils: { type: utype } } = __o;
class rwCounter {
    constructor(rt, idx) {
        this.rt = rt;
        this.idx = idx;
        this.attr = _c(rt).nattr(["max", 'min', 'sym', 'tm']);
        rt.parentNode.rwc = this;
        observer.observe(rt.parentNode);
        //__o.log(this.attr, this.rt, observer);
    }
    run(Io) {
        if (utype(Io, 'obj') && Io.iR > 0.9) {
            const { rt, attr: a } = this;
            let [n, m] = ['in', 'ax'].map(e => Number(a['m' + e]));
            //__o.log('run', utype(Io, 'obj'), Io.iR > 0.9, Io.dir, m != NaN, m != NaN);
            if (m != NaN && m != NaN && Io.dir === 0) {
                //__o.log('counterAnima', rt, n, m, a.sym, a.tm);
                counterIncreaseAnimation(rt, n, m, a.sym, 0, 1e3);
            }
        }
    };
    static init() {
        const tln = _c(document).all(".rw-blocks-counter");
        for (let j = 0; j < tln.length; j++) new rwCounter(tln[j], j);
    }
}
function OBS(et) {
    const s = window.scrollY;
    let d;
    if (!utype(this.prev, 'unu')) {
        d = this.dir = s > this.prev ? 0 : 1;
    }
    this.prev = s;
    // __o.log(d, this.dir, this.prev);
    let fn = et.map(entries);
    function entries(e) {
        const { intersectionRatio: iR, boundingClientRect: bCR,
            rootBounds: rB, isVisible: isV, isIntersecting: isI } = e;
        const { top: t, left: l, width: w, height: h } = bCR;
        const { top: rT, left: rL, width: rW, height: rH } = rB;
        const f = {
            el: e.target,
            iR, bCR, rB, isV, isI,
            start: (t < rT && l < rL) ? 'tl' :
                (t < rT) ? 't' : (l < rL) ? 'l' : 0,
            end: (t + h > rT + rH && l + w > rL + rW) ? 'br' :
                (t + h > rT + rH) ? 'b' : (l + w > rL + rW) ? 'r' : 0,
            dir: d
        };
        e.target?.rwc?.run(f);
        return f;
    }
    //__o.log(this, fn);
}
const observer = __o.mkObs(0, OBS, {
    threshold: [0, 0.1, 0.5, 0.9, 1],
});

_ui.obs = observer;
_c(document).on("DOMContentLoaded", rwCounter.init);
_ui.rwCounter = rwCounter;
function counterIncreaseAnimation(el, start, end, sym, step, dur = 1e2, lfps = false) {
    let c = start;
    //onst totalFrames = dur / 16; // 16ms = 60fps
    //const increment = Math.abs((end - start) / totalFrames);
    const inc = start < end;
    let stm = null;
    let ltm = null;
    const isInt = __o.utils.type(start, 'int') && __o.utils.type(end, 'int');
    //__o.log(c, increment, start, end, el);
    const animate = (tm) => {
        stm ??= tm;
        const elapsed = tm - stm;
        const prog = Math.min(elapsed / dur, 1);
        c = inc
            ? start + (end - start) * prog
            : start - (start - end) * prog;
        if (lfps && ltm)
            __o.log(`FPS: ${(1000 / (tm - ltm)).toFixed(2)}`);
        ltm = tm;

        let k = (inc && c < end) || (!inc && c > end);
        el.textContent = `${isInt ? Math.floor(k ? c : end) : (k ? c : end).toFixed(2)}${sym ?? ''}`;
        // Ensure the counter ends exactly at the end value
        k && __o.reqAnima(animate);
    };
    __o.reqAnima(animate);
}

//animateCounter(0, 100, 2000);
/* $thrive$ mountain east raw unusual another chimney census scene extra mom boil */
