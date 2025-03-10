void main() {
    vec2 screenUv = gl_FragCoord.xy / resolution; // get uvs from pixel coord
    vec2 uv = coverUv(screenUv); // aspect correct

    vec2 gridUv = fract(uv * gridSize);

    gl_FragColor = vec4(gridUv.x, gridUv.y, 0.0, 1.0);
}