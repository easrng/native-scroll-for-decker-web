delete document.body.onwheel;
let i = 0;
const rect2key = ({ x, y, w, h }) =>
  zoom + "|" + x + "|" + y + "|" + w + "|" + h;
let scrolls = new Map();
let lastScrolls = new Map();
const container = document.createElement("div");
container.style = `
  width: 512px;
  height: 342px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  user-select: none;`;
document.body.appendChild(container);
const realscrollbar = scrollbar;
let newele = false;
const scrollele = (r) => {
  const k = rect2key(r);
  let s = lastScrolls.get(k);
  newele = false;
  if (!s) {
    newele = true;
    s = document.createElement("div");
    s.style =
      "display:block;overflow-y:scroll;position:absolute;scrollbar-width: none;top:" +
      r.y * zoom +
      "px;left:" +
      r.x * zoom +
      "px;width:" +
      r.w * zoom +
      "px;height:" +
      r.h * zoom +
      "px";
    const c = document.createElement("div");
    c.style = "pointer-events:none;";
    s.appendChild(c);
    container.appendChild(s);
  }
  scrolls.set(k, s);
  return s;
};
scrollbar = (r, n, line, page, scroll, visible, inverted) => {
  const result = realscrollbar(r, n, line, page, scroll, visible, inverted);
  if (visible) {
    const ele = scrollele(r);
    ele.firstChild.style.height = (r.h + n) * zoom + "px";
    if (newele) {
      ele.scrollTop = scroll * zoom;
    } else {
      result.scroll = Math.round(ele.scrollTop / zoom);
    }
  }
  return result;
};
const realtick = tick;
tick = () => {
  lastScrolls = scrolls;
  scrolls = new Map();
  realtick();
  for (const k of scrolls.keys()) {
    lastScrolls.delete(k);
  }
  for (const v of lastScrolls.values()) {
    v.remove();
  }
  container.style.width = display.width + "px";
  container.style.height = display.height + "px";
  container.style.cursor = display.style.cursor;
};
