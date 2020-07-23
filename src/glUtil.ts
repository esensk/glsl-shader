export enum ShaderType {
  Vertex,
  Fragment,
}

function createShader(gl: WebGLRenderingContext, shaderType: ShaderType, shaderCode: string): WebGLShader | void {
  const glType = shaderType === ShaderType.Vertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
  const shader: WebGLShader = gl.createShader(glType)
  gl.shaderSource(shader, shaderCode)
  gl.compileShader(shader)
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : (() => {
    alert(gl.getShaderInfoLog(shader));
    console.log(shaderCode);
  })();
}

export function createProgram(gl: WebGLRenderingContext, vertCode: string, fragCode: string): WebGLProgram | void {
  const vertex: WebGLShader = createShader(gl, ShaderType.Vertex, vertCode) as WebGLShader;
  const fragment: WebGLShader = createShader(gl, ShaderType.Fragment, fragCode) as WebGLShader;
  const program: WebGLProgram = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return alert(gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);
  return program;
}

export function createVbo(gl: WebGLRenderingContext, data: number[]): WebGLBuffer {
  const vbo: WebGLBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return vbo;
}

export function createIbo(gl: WebGLRenderingContext, data: number[]): WebGLBuffer {
  const ibo: WebGLBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return ibo;
}
