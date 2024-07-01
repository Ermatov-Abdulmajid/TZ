precision highp float;
varying vec2 texCoord;

uniform float opacity;
uniform sampler2D sucaiTexture;

void main(void)
{
    vec4 sucai = texture2D(sucaiTexture, texCoord);
    gl_FragColor = vec4(sucai.rgb, opacity);
}
 