precision highp float;
varying vec2 texCoord;
varying vec2 sucaiTexCoord;
varying vec2 srcUV;
uniform float opacity;

uniform sampler2D sucaiImageTexture;

uniform float intensity;


void main(void)
{
    vec4 sucai = texture2D(sucaiImageTexture, sucaiTexCoord);
    gl_FragColor = vec4(sucai.rgb,1.0);
}
 