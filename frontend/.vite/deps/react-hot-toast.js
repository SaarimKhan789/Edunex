"use client";
import {
  __toESM,
  require_react
} from "./chunk-JRE55LYH.js";

// node_modules/react-hot-toast/dist/index.mjs
var import_react = __toESM(require_react(), 1);
var import_react2 = __toESM(require_react(), 1);
var l2 = __toESM(require_react(), 1);

// node_modules/goober/dist/goober.modern.js
var e = { data: "" };
var t = (t2) => "object" == typeof window ? ((t2 ? t2.querySelector("#_goober") : window._goober) || Object.assign((t2 || document.head).appendChild(document.createElement("style")), { innerHTML: " ", id: "_goober" })).firstChild : t2 || e;
var l = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g;
var a = /\/\*[^]*?\*\/|  +/g;
var n = /\n+/g;
var o = (e2, t2) => {
  let r = "", l3 = "", a2 = "";
  for (let n3 in e2) {
    let c2 = e2[n3];
    "@" == n3[0] ? "i" == n3[1] ? r = n3 + " " + c2 + ";" : l3 += "f" == n3[1] ? o(c2, n3) : n3 + "{" + o(c2, "k" == n3[1] ? "" : t2) + "}" : "object" == typeof c2 ? l3 += o(c2, t2 ? t2.replace(/([^,])+/g, (e3) => n3.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g, (t3) => /&/.test(t3) ? t3.replace(/&/g, e3) : e3 ? e3 + " " + t3 : t3)) : n3) : null != c2 && (n3 = /^--/.test(n3) ? n3 : n3.replace(/[A-Z]/g, "-$&").toLowerCase(), a2 += o.p ? o.p(n3, c2) : n3 + ":" + c2 + ";");
  }
  return r + (t2 && a2 ? t2 + "{" + a2 + "}" : a2) + l3;
};
var c = {};
var s = (e2) => {
  if ("object" == typeof e2) {
    let t2 = "";
    for (let r in e2) t2 += r + s(e2[r]);
    return t2;
  }
  return e2;
};
var i = (e2, t2, r, i2, p2) => {
  let u3 = s(e2), d2 = c[u3] || (c[u3] = ((e3) => {
    let t3 = 0, r2 = 11;
    for (; t3 < e3.length; ) r2 = 101 * r2 + e3.charCodeAt(t3++) >>> 0;
    return "go" + r2;
  })(u3));
  if (!c[d2]) {
    let t3 = u3 !== e2 ? e2 : ((e3) => {
      let t4, r2, o2 = [{}];
      for (; t4 = l.exec(e3.replace(a, "")); ) t4[4] ? o2.shift() : t4[3] ? (r2 = t4[3].replace(n, " ").trim(), o2.unshift(o2[0][r2] = o2[0][r2] || {})) : o2[0][t4[1]] = t4[2].replace(n, " ").trim();
      return o2[0];
    })(e2);
    c[d2] = o(p2 ? { ["@keyframes " + d2]: t3 } : t3, r ? "" : "." + d2);
  }
  let f3 = r && c.g ? c.g : null;
  return r && (c.g = c[d2]), ((e3, t3, r2, l3) => {
    l3 ? t3.data = t3.data.replace(l3, e3) : -1 === t3.data.indexOf(e3) && (t3.data = r2 ? e3 + t3.data : t3.data + e3);
  })(c[d2], t2, i2, f3), d2;
};
var p = (e2, t2, r) => e2.reduce((e3, l3, a2) => {
  let n3 = t2[a2];
  if (n3 && n3.call) {
    let e4 = n3(r), t3 = e4 && e4.props && e4.props.className || /^go/.test(e4) && e4;
    n3 = t3 ? "." + t3 : e4 && "object" == typeof e4 ? e4.props ? "" : o(e4, "") : false === e4 ? "" : e4;
  }
  return e3 + l3 + (null == n3 ? "" : n3);
}, "");
function u(e2) {
  let r = this || {}, l3 = e2.call ? e2(r.p) : e2;
  return i(l3.unshift ? l3.raw ? p(l3, [].slice.call(arguments, 1), r.p) : l3.reduce((e3, t2) => Object.assign(e3, t2 && t2.call ? t2(r.p) : t2), {}) : l3, t(r.target), r.g, r.o, r.k);
}
var d;
var f;
var g;
var b = u.bind({ g: 1 });
var h = u.bind({ k: 1 });
function m(e2, t2, r, l3) {
  o.p = t2, d = e2, f = r, g = l3;
}
function j(e2, t2) {
  let r = this || {};
  return function() {
    let l3 = arguments;
    function a2(n3, o2) {
      let c2 = Object.assign({}, n3), s2 = c2.className || a2.className;
      r.p = Object.assign({ theme: f && f() }, c2), r.o = / *go\d+/.test(s2), c2.className = u.apply(r, l3) + (s2 ? " " + s2 : ""), t2 && (c2.ref = o2);
      let i2 = e2;
      return e2[0] && (i2 = c2.as || e2, delete c2.as), g && i2[0] && g(c2), d(i2, c2);
    }
    return t2 ? t2(a2) : a2;
  };
}

// node_modules/react-hot-toast/dist/index.mjs
var y = __toESM(require_react(), 1);
var f2 = __toESM(require_react(), 1);
var W = (e2) => typeof e2 == "function";
var T = (e2, t2) => W(e2) ? e2(t2) : e2;
var U = /* @__PURE__ */ (() => {
  let e2 = 0;
  return () => (++e2).toString();
})();
var b2 = /* @__PURE__ */ (() => {
  let e2;
  return () => {
    if (e2 === void 0 && typeof window < "u") {
      let t2 = matchMedia("(prefers-reduced-motion: reduce)");
      e2 = !t2 || t2.matches;
    }
    return e2;
  };
})();
var Q = 20;
var S = /* @__PURE__ */ new Map();
var X = 1e3;
var $ = (e2) => {
  if (S.has(e2)) return;
  let t2 = setTimeout(() => {
    S.delete(e2), u2({ type: 4, toastId: e2 });
  }, X);
  S.set(e2, t2);
};
var J = (e2) => {
  let t2 = S.get(e2);
  t2 && clearTimeout(t2);
};
var v = (e2, t2) => {
  switch (t2.type) {
    case 0:
      return { ...e2, toasts: [t2.toast, ...e2.toasts].slice(0, Q) };
    case 1:
      return t2.toast.id && J(t2.toast.id), { ...e2, toasts: e2.toasts.map((r) => r.id === t2.toast.id ? { ...r, ...t2.toast } : r) };
    case 2:
      let { toast: o2 } = t2;
      return e2.toasts.find((r) => r.id === o2.id) ? v(e2, { type: 1, toast: o2 }) : v(e2, { type: 0, toast: o2 });
    case 3:
      let { toastId: s2 } = t2;
      return s2 ? $(s2) : e2.toasts.forEach((r) => {
        $(r.id);
      }), { ...e2, toasts: e2.toasts.map((r) => r.id === s2 || s2 === void 0 ? { ...r, visible: false } : r) };
    case 4:
      return t2.toastId === void 0 ? { ...e2, toasts: [] } : { ...e2, toasts: e2.toasts.filter((r) => r.id !== t2.toastId) };
    case 5:
      return { ...e2, pausedAt: t2.time };
    case 6:
      let a2 = t2.time - (e2.pausedAt || 0);
      return { ...e2, pausedAt: void 0, toasts: e2.toasts.map((r) => ({ ...r, pauseDuration: r.pauseDuration + a2 })) };
  }
};
var A = [];
var P = { toasts: [], pausedAt: void 0 };
var u2 = (e2) => {
  P = v(P, e2), A.forEach((t2) => {
    t2(P);
  });
};
var Y = { blank: 4e3, error: 4e3, success: 2e3, loading: 1 / 0, custom: 4e3 };
var I = (e2 = {}) => {
  let [t2, o2] = (0, import_react.useState)(P);
  (0, import_react.useEffect)(() => (A.push(o2), () => {
    let a2 = A.indexOf(o2);
    a2 > -1 && A.splice(a2, 1);
  }), [t2]);
  let s2 = t2.toasts.map((a2) => {
    var r, c2;
    return { ...e2, ...e2[a2.type], ...a2, duration: a2.duration || ((r = e2[a2.type]) == null ? void 0 : r.duration) || (e2 == null ? void 0 : e2.duration) || Y[a2.type], style: { ...e2.style, ...(c2 = e2[a2.type]) == null ? void 0 : c2.style, ...a2.style } };
  });
  return { ...t2, toasts: s2 };
};
var G = (e2, t2 = "blank", o2) => ({ createdAt: Date.now(), visible: true, type: t2, ariaProps: { role: "status", "aria-live": "polite" }, message: e2, pauseDuration: 0, ...o2, id: (o2 == null ? void 0 : o2.id) || U() });
var h2 = (e2) => (t2, o2) => {
  let s2 = G(t2, e2, o2);
  return u2({ type: 2, toast: s2 }), s2.id;
};
var n2 = (e2, t2) => h2("blank")(e2, t2);
n2.error = h2("error");
n2.success = h2("success");
n2.loading = h2("loading");
n2.custom = h2("custom");
n2.dismiss = (e2) => {
  u2({ type: 3, toastId: e2 });
};
n2.remove = (e2) => u2({ type: 4, toastId: e2 });
n2.promise = (e2, t2, o2) => {
  let s2 = n2.loading(t2.loading, { ...o2, ...o2 == null ? void 0 : o2.loading });
  return e2.then((a2) => (n2.success(T(t2.success, a2), { id: s2, ...o2, ...o2 == null ? void 0 : o2.success }), a2)).catch((a2) => {
    n2.error(T(t2.error, a2), { id: s2, ...o2, ...o2 == null ? void 0 : o2.error });
  }), e2;
};
var Z = (e2, t2) => {
  u2({ type: 1, toast: { id: e2, height: t2 } });
};
var ee = () => {
  u2({ type: 5, time: Date.now() });
};
var D = (e2) => {
  let { toasts: t2, pausedAt: o2 } = I(e2);
  (0, import_react2.useEffect)(() => {
    if (o2) return;
    let r = Date.now(), c2 = t2.map((i2) => {
      if (i2.duration === 1 / 0) return;
      let d2 = (i2.duration || 0) + i2.pauseDuration - (r - i2.createdAt);
      if (d2 < 0) {
        i2.visible && n2.dismiss(i2.id);
        return;
      }
      return setTimeout(() => n2.dismiss(i2.id), d2);
    });
    return () => {
      c2.forEach((i2) => i2 && clearTimeout(i2));
    };
  }, [t2, o2]);
  let s2 = (0, import_react2.useCallback)(() => {
    o2 && u2({ type: 6, time: Date.now() });
  }, [o2]), a2 = (0, import_react2.useCallback)((r, c2) => {
    let { reverseOrder: i2 = false, gutter: d2 = 8, defaultPosition: p2 } = c2 || {}, g2 = t2.filter((m2) => (m2.position || p2) === (r.position || p2) && m2.height), E = g2.findIndex((m2) => m2.id === r.id), x = g2.filter((m2, R) => R < E && m2.visible).length;
    return g2.filter((m2) => m2.visible).slice(...i2 ? [x + 1] : [0, x]).reduce((m2, R) => m2 + (R.height || 0) + d2, 0);
  }, [t2]);
  return { toasts: t2, handlers: { updateHeight: Z, startPause: ee, endPause: s2, calculateOffset: a2 } };
};
var oe = h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`;
var re = h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`;
var se = h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`;
var _ = j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e2) => e2.primary || "#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${oe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${re} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${(e2) => e2.secondary || "#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${se} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`;
var ne = h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
var V = j("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${(e2) => e2.secondary || "#e0e0e0"};
  border-right-color: ${(e2) => e2.primary || "#616161"};
  animation: ${ne} 1s linear infinite;
`;
var pe = h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`;
var de = h`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`;
var w = j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e2) => e2.primary || "#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${pe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${de} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${(e2) => e2.secondary || "#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`;
var ue = j("div")`
  position: absolute;
`;
var le = j("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`;
var Te = h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`;
var fe = j("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Te} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`;
var M = ({ toast: e2 }) => {
  let { icon: t2, type: o2, iconTheme: s2 } = e2;
  return t2 !== void 0 ? typeof t2 == "string" ? y.createElement(fe, null, t2) : t2 : o2 === "blank" ? null : y.createElement(le, null, y.createElement(V, { ...s2 }), o2 !== "loading" && y.createElement(ue, null, o2 === "error" ? y.createElement(_, { ...s2 }) : y.createElement(w, { ...s2 })));
};
var ye = (e2) => `
0% {transform: translate3d(0,${e2 * -200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`;
var ge = (e2) => `
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e2 * -150}%,-1px) scale(.6); opacity:0;}
`;
var he = "0%{opacity:0;} 100%{opacity:1;}";
var xe = "0%{opacity:1;} 100%{opacity:0;}";
var be = j("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`;
var Se = j("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;
var Ae = (e2, t2) => {
  let s2 = e2.includes("top") ? 1 : -1, [a2, r] = b2() ? [he, xe] : [ye(s2), ge(s2)];
  return { animation: t2 ? `${h(a2)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards` : `${h(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)` };
};
var F = l2.memo(({ toast: e2, position: t2, style: o2, children: s2 }) => {
  let a2 = e2.height ? Ae(e2.position || t2 || "top-center", e2.visible) : { opacity: 0 }, r = l2.createElement(M, { toast: e2 }), c2 = l2.createElement(Se, { ...e2.ariaProps }, T(e2.message, e2));
  return l2.createElement(be, { className: e2.className, style: { ...a2, ...o2, ...e2.style } }, typeof s2 == "function" ? s2({ icon: r, message: c2 }) : l2.createElement(l2.Fragment, null, r, c2));
});
m(f2.createElement);
var Ee = ({ id: e2, className: t2, style: o2, onHeightUpdate: s2, children: a2 }) => {
  let r = f2.useCallback((c2) => {
    if (c2) {
      let i2 = () => {
        let d2 = c2.getBoundingClientRect().height;
        s2(e2, d2);
      };
      i2(), new MutationObserver(i2).observe(c2, { subtree: true, childList: true, characterData: true });
    }
  }, [e2, s2]);
  return f2.createElement("div", { ref: r, className: t2, style: o2 }, a2);
};
var Re = (e2, t2) => {
  let o2 = e2.includes("top"), s2 = o2 ? { top: 0 } : { bottom: 0 }, a2 = e2.includes("center") ? { justifyContent: "center" } : e2.includes("right") ? { justifyContent: "flex-end" } : {};
  return { left: 0, right: 0, display: "flex", position: "absolute", transition: b2() ? void 0 : "all 230ms cubic-bezier(.21,1.02,.73,1)", transform: `translateY(${t2 * (o2 ? 1 : -1)}px)`, ...s2, ...a2 };
};
var ve = u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;
var O = 16;
var Ie = ({ reverseOrder: e2, position: t2 = "top-center", toastOptions: o2, gutter: s2, children: a2, containerStyle: r, containerClassName: c2 }) => {
  let { toasts: i2, handlers: d2 } = D(o2);
  return f2.createElement("div", { style: { position: "fixed", zIndex: 9999, top: O, left: O, right: O, bottom: O, pointerEvents: "none", ...r }, className: c2, onMouseEnter: d2.startPause, onMouseLeave: d2.endPause }, i2.map((p2) => {
    let g2 = p2.position || t2, E = d2.calculateOffset(p2, { reverseOrder: e2, gutter: s2, defaultPosition: t2 }), x = Re(g2, E);
    return f2.createElement(Ee, { id: p2.id, key: p2.id, onHeightUpdate: d2.updateHeight, className: p2.visible ? ve : "", style: x }, p2.type === "custom" ? T(p2.message, p2) : a2 ? a2(p2) : f2.createElement(F, { toast: p2, position: g2 }));
  }));
};
var _t = n2;
export {
  w as CheckmarkIcon,
  _ as ErrorIcon,
  V as LoaderIcon,
  F as ToastBar,
  M as ToastIcon,
  Ie as Toaster,
  _t as default,
  T as resolveValue,
  n2 as toast,
  D as useToaster,
  I as useToasterStore
};
//# sourceMappingURL=react-hot-toast.js.map
