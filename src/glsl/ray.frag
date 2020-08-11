precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 cameraPos = vec3(0.0, 0.0, 3.0);
    vec3 cameraDir = vec3(0.0, 0.0, -1.0);
    vec3 cameraUp = vec3(0.0, 1.0, 0.0);
    vec3 cameraSide = cross(cameraDir, cameraUp);
    float targetDepth = 0.1;

    vec3 ray = normalize(cameraSide * p.x + cameraUp * p.y + cameraDir * targetDepth);

    gl_FragColor = vec4(ray.xy, -ray.z, 1.0);

}
