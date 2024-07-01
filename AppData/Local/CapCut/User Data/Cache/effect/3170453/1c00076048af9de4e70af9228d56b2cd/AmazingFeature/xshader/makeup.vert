attribute vec3 attPosition;
attribute vec2 attUV;
varying vec2 texCoord;

uniform mat4 uMVPMatrix;
uniform mat4 uSTMatrix;

void main(void)
{
    gl_Position = uMVPMatrix * vec4(attPosition, 1.0);
    texCoord = (uSTMatrix * vec4(attUV.xy, 0.0, 1.0)).xy;
}
 