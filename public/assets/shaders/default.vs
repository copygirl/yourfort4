attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;
}
