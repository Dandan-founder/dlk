"use client";

import { useEffect, useRef } from "react";

/**
 * Fundo do hero em WebGL puro (sem bibliotecas: ~3 KB). Campo de névoa azul-marinho em movimento lento
 * e uma luz laranja — o ponto da marca — que persegue o cursor com atraso.
 * Economia: resolução reduzida, pausa fora da tela e na aba oculta, um único quadro com movimento reduzido.
 */
const frag = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntro;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes.xy) / uRes.y;
  float t = uTime * 0.045;
  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 3.1));
  float n = fbm(p * 1.8 + q * 1.6 + vec2(t * 0.6, -t * 0.4));

  vec3 voidc = vec3(0.027, 0.043, 0.086);
  vec3 navy = vec3(0.075, 0.13, 0.235);
  vec3 col = mix(voidc, navy * 1.25, smoothstep(0.35, 0.95, n) * 0.85);

  // luz do ponto laranja seguindo o cursor
  vec2 m = (uMouse - 0.5 * uRes.xy) / uRes.y;
  float d = length(p - m);
  float glow = exp(-d * d * 7.0) * (0.55 + 0.45 * n);
  col += vec3(0.95, 0.42, 0.11) * glow * 0.55 * uIntro;
  // borda superior direita mais clara (profundidade)
  col += navy * 0.35 * smoothstep(1.2, 0.0, length(p - vec2(0.9, 0.55)));
  // vinheta + escurecimento na base para o texto
  col *= mix(0.55, 1.0, smoothstep(0.0, 0.55, uv.y));
  col *= 1.0 - 0.35 * length(uv - 0.5);
  // grão (evita faixas no degradê)
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.025;
  gl_FragColor = vec4(col * uIntro + voidc * (1.0 - uIntro), 1.0);
}`;

const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
    // Sem GPU (renderizador por software) ou movimento reduzido: um único quadro parado
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
    const software = /swiftshader|llvmpipe|software/i.test(renderer);
    const reduce = software || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uIntro = gl.getUniformLocation(prog, "uIntro");

    // meia resolução: o desfoque natural do campo esconde a diferença
    const scale = Math.min(window.devicePixelRatio || 1, 2) * (small ? 0.32 : 0.5);
    const size = { w: 1, h: 1 };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      size.w = Math.max(1, Math.round(r.width * scale));
      size.h = Math.max(1, Math.round(r.height * scale));
      canvas.width = size.w;
      canvas.height = size.h;
      gl.viewport(0, 0, size.w, size.h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: size.w * 0.72, y: size.h * 0.6, tx: size.w * 0.72, ty: size.h * 0.6 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) * scale;
      mouse.ty = (r.height - (e.clientY - r.top)) * scale;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let visible = true;
    let last = 0;
    const t0 = performance.now();
    const draw = (now: number) => {
      // 30 quadros por segundo bastam para um campo que se move devagar
      if (!reduce && now - last < 32) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = now;
      const t = (now - t0) / 1000;
      // sem mouse (celular), a luz passeia sozinha devagar
      if (!window.matchMedia("(hover: hover)").matches) {
        mouse.tx = size.w * (0.6 + 0.25 * Math.sin(t * 0.25));
        mouse.ty = size.h * (0.55 + 0.2 * Math.cos(t * 0.31));
      }
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      gl.uniform2f(uRes, size.w, size.h);
      gl.uniform1f(uTime, reduce ? 12 : t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uIntro, reduce ? 1 : Math.min(1, Math.max(0, (t - 0.6) / 1.4)));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && visible && !reduce) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
