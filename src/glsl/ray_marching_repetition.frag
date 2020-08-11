precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float SphereSize = 1.0;
const vec3 LightDirection = vec3(-0.57, 0.57, 0.57);
const float TargetDepth = 1.0;

const vec3 CameraPos = vec3(0, 0, 3);
const vec3 CameraDir = vec3(0.0, 0.0, -1);
const vec3 CameraUp = vec3(0, 1, 0);

const float Pi = 3.14159265;

vec3 trans(vec3 p) {
    return mod(p, 5.0) - 2.5;
}

float distanceCube(vec3 p) {
    vec3 q = abs(trans(p));
    return length(max(q - vec3(0.5, 0.5, 0.5), 0.0)) - 0.1;
}

float distanceSphere(vec3 p) {
    return length(trans(p)) - SphereSize;
}

float distanceTorus(vec3 p) {
    vec2 t = vec2(0.75, 0.25);
    vec2 r = vec2(length(p.xy) - t.x, p.z);
    return length(r) - t.y;
}

float distanceFloor(vec3 p) {
    return dot(p, vec3(0.0, 1.0, 0.0)) + 1.0;
}

float distanceFunc(vec3 p) {
    return min(distanceTorus(p), distanceFloor(p));
}

vec3 getNormal(vec3 p) {
    float d = 0.0001;
    return normalize(vec3(
        distanceFunc(p + vec3(d, 0.0, 0.0)) - distanceFunc(p + vec3(-d, 0.0, 0.0)),
        distanceFunc(p + vec3(0.0, d, 0.0)) - distanceFunc(p + vec3(0.0, -d, 0.0)),
        distanceFunc(p + vec3(0.0, 0.0, d)) - distanceFunc(p + vec3(0.0, 0.0, -d))
    ));
}

void main(void) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    // const float Angle = 60.0;
    // const float Fov = Angle * 0.5 * Pi / 180.0;
    const vec3 CameraSide = cross(CameraDir, CameraUp);
    vec3 ray = normalize(CameraSide * p.x + CameraUp * p.y + CameraDir * TargetDepth);

    float dist = 0.0;
    float rayLen = 0.0;
    vec3 rayPos = CameraPos;
    for(int i = 0; i < 256; ++i) {
        float distFloor = distanceFloor(rayPos);
        float distTorus = distanceTorus(rayPos);
        dist = min(distFloor, distTorus);
        rayLen += dist;
        rayPos = CameraPos + ray * rayLen;
    }

    if (abs(dist) < 0.001) {
        vec3 normal = getNormal(rayPos);
        float diff = clamp(dot(LightDirection, normal), 0.1, 1.0);
        gl_FragColor = vec4(vec3(diff), 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
