import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getISO } from "../utils/geo.js";
import { createRenderer } from "./renderCompositor.js";
import { createControls } from "./controlCompositor.js";
import { createSearchCompositor } from "./searchCompositor.js";

export function createGlobe(canvas, features, { onClick, onHover }) {
  const { context, projection, path, stateRefs, start } = createGlobeEngine(canvas);

  const renderer = createRenderer({ context, projection, path, features, getISO });

  let searchCompositor;

  const controls = createControls({ canvas, projection, path, features, getISO, stateRefs,
    onClick: country => {
      searchCompositor.syncCountry(country);
      onClick?.(country);
    },
    onHover
  });

  searchCompositor = createSearchCompositor({ features, controls });
  start(renderer, controls);
}

function createGlobeEngine(canvas) {
  const context = canvas.getContext("2d");
  const projection = d3.geoOrthographic().clipAngle(90);
  const path = d3.geoPath(projection, context);

  let width;
  let height;
  let scale;
  const rotation = [-6, -24];
  const velocity = [0, 0];

  const stateRefs = { rotation, velocity };

  function resize() {
    const dpr = window.devicePixelRatio || 1;

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(dpr, dpr);

    scale = height / 3;

    projection.translate([width / 2, height / 2]).scale(scale).rotate(rotation);
  }

  function start(renderer, controls) {
    function animate() {
      velocity[0] *= 0.92;
      velocity[1] *= 0.92;

      rotation[0] += velocity[0];
      rotation[1] = Math.max(-90, Math.min(90, rotation[1] + velocity[1]));

      projection.rotate(rotation);

      renderer.render({ hovered: controls.getHovered(), rotation, scale, width, height });

      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    resize();
    animate();
  }

  return { context, projection, path, stateRefs, start };
}