precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float SphereSize = 1.0;
const vec3 LightDirection = vec3(-0.577, 0.577, 0.577);

float distanceSphere(vec3 p) {
    return length(p) - SphereSize;
}

vec3 getNormal(vec3 p) {
    float d = 0.0001;
    return normalize(vec3(
        distanceSphere(p + vec3(d, 0.0, 0.0)) - distanceSphere(p + vec3(-d, 0.0, 0.0)),
        distanceSphere(p + vec3(0.0, d, 0.0)) - distanceSphere(p + vec3(0.0, -d, 0.0)),
        distanceSphere(p + vec3(0.0, 0.0, d)) - distanceSphere(p + vec3(0.0, 0.0, -d))
    ));
}

void main(void) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 cameraPos = vec3(0.0, 0.0, 2.0);
    vec3 cameraDir = vec3(0.0, 0.0, -1.0);
    vec3 cameraUp = vec3(0.0, 1.0, 0.0);
    vec3 cameraSide = cross(cameraDir, cameraUp);
    float targetDepth = 0.1;

    vec3 ray = normalize(cameraSide * p.x + cameraUp * p.y + cameraDir * targetDepth);

    float dist = 0.0;
    float rayLen = 0.0;
    vec3 rayPos = cameraPos;
    for(int i = 0; i < 16; ++i) {
        dist = distanceSphere(rayPos);
        rayLen += dist;
        rayPos = cameraPos + ray * rayLen;
    }

    if (abs(dist) < 0.001) {
        vec3 normal = getNormal(rayPos);
        float diff = clamp(dot(LightDirection, normal), 0.1, 1.0);
        gl_FragColor = vec4(vec3(diff), 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
