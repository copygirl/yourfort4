varying highp vec2 vTextureCoord;

uniform lowp vec4 uColor;
uniform sampler2D uSampler;

void main(void) {
  gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;
}
