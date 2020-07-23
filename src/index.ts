import * as glsl from "./glUtil";
import sampleVert from "./sample.vert";
import sampleFrag from "./sample.frag";
import voltexFrag from "./vortex.frag"

const WIDTH: number = 512;
const HEIGHT: number = 512;
const FPS: number = 1000 / 30;

const POSITION_DATA: number[] = [
  -1.0, 1.0, 0.0,
  1.0, 1.0, 0.0,
  -1.0, -1.0, 0.0,
  1.0, -1.0, 0.0,
];

const INDEX_DATA: number[] = [
  0, 2, 1,
  1, 2, 3,
];

let mouseX: number = 0.5;
let mouseY: number = 0.5;
let run: boolean = true;

let startTime: number = 0;
let time: number = 0;
let notRunTime: number = 0;


window.onload = function () {
  let canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const autoRun = document.getElementById('check') as HTMLInputElement;

  canvas.addEventListener('mousemove', e => {
    mouseX = e.offsetX / WIDTH;
    mouseY = e.offsetY / HEIGHT;
  }, true);

  autoRun.addEventListener('change', e => {
    const target = e.target as HTMLInputElement;
    run = target.checked
    if (run) {
      startTime = new Date().getTime();
      render(gl, uniformTime, uniformMouse, uniformResolution);
    } else {
      notRunTime += time;
    }
  }, true);

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
  const prg = glsl.createProgram(gl, sampleVert, voltexFrag) as WebGLProgram;

  if (!prg) {
    autoRun.checked = false;
    return;
  }

  const uniformTime = gl.getUniformLocation(prg, 'time') as WebGLUniformLocation;
  const uniformMouse = gl.getUniformLocation(prg, 'mouse') as WebGLUniformLocation;
  const uniformResolution = gl.getUniformLocation(prg, 'resolution') as WebGLUniformLocation;

  const attribPosition = gl.getAttribLocation(prg, 'position');
  const positionBuffer = glsl.createVbo(gl, POSITION_DATA);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(attribPosition);
  gl.vertexAttribPointer(attribPosition, 3, gl.FLOAT, false, 0, 0);

  const indexBuffer = glsl.createIbo(gl, INDEX_DATA);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  mouseX = 0.5;
  mouseY = 0.5;
  startTime = new Date().getTime();

  render(gl, uniformTime, uniformMouse, uniformResolution);
}

function render(gl: WebGLRenderingContext, uniformTime: WebGLUniformLocation, uniformMouse: WebGLUniformLocation, unifromResolution: WebGLUniformLocation): void {
  if (!run) {
    return;
  }

  time = (new Date().getTime() - startTime) * 0.001;

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(uniformTime, time + notRunTime);
  gl.uniform2fv(uniformMouse, [mouseX, mouseY]);
  gl.uniform2fv(unifromResolution, [WIDTH, HEIGHT]);

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  gl.flush();

  setTimeout(() => {
    render(gl, uniformTime, uniformMouse, unifromResolution);
  }, FPS);
}
