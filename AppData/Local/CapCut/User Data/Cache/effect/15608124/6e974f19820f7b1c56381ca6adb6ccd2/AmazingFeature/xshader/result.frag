precision highp float;

uniform sampler2D inputImageTexture;
varying vec2 uv;
uniform sampler2D edgeTexture;
uniform sampler2D filterTex;
uniform float filterIns;
uniform float whiteEdgeIns;
uniform float blackEdgeIns;
uniform float sharpIns;
uniform sampler2D faceTex;

vec4 takeEffectFilter(sampler2D myfilter,vec4 inputColor,float how)
{

    highp float blueColor=inputColor.b*63.;

    highp vec2 quad1;
    quad1.y=floor(floor(blueColor)/8.);
    quad1.x=floor(blueColor)-(quad1.y*8.);

    highp vec2 quad2;
    quad2.y=floor(ceil(blueColor)/8.);
    quad2.x=ceil(blueColor)-(quad2.y*8.);

    highp vec2 texPos1;
    texPos1.x=(quad1.x*1./8.)+.5/512.+((1./8.-1./512.)*inputColor.r);
    texPos1.y=(quad1.y*1./8.)+.5/512.+((1./8.-1./512.)*inputColor.g);

    highp vec2 texPos2;
    texPos2.x=(quad2.x*1./8.)+.5/512.+((1./8.-1./512.)*inputColor.r);
    texPos2.y=(quad2.y*1./8.)+.5/512.+((1./8.-1./512.)*inputColor.g);

    lowp vec4 newColor1=texture2D(myfilter,texPos1);
    lowp vec4 newColor2=texture2D(myfilter,texPos2);
    lowp vec4 newColor=mix(newColor1,newColor2,fract(blueColor));
    newColor = mix(inputColor,vec4(newColor.rgb,inputColor.w),how);
    return newColor;

}

float blendDarken(float base, float blend) {
    return min(blend,base);
}

vec3 blendDarken(vec3 base, vec3 blend) {
    return vec3(blendDarken(base.r,blend.r),blendDarken(base.g,blend.g),blendDarken(base.b,blend.b));
}

float blendLighten(float base, float blend) {
    return max(blend,base);
}

vec3 blendLighten(vec3 base, vec3 blend) {
    return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}
void main()
{

    vec4 oriCol = texture2D(inputImageTexture, uv);
    vec4 edgeCol = texture2D(edgeTexture, uv);
    edgeCol.rgb = mix(edgeCol.rgb,blendDarken(edgeCol.rgb,vec3(0.5)),clamp(1.0-whiteEdgeIns,0.0,1.0));
    edgeCol.rgb = mix(edgeCol.rgb,blendLighten(edgeCol.rgb,vec3(0.5)),clamp(1.0-blackEdgeIns,0.0,1.0));
    edgeCol.rgb = mix(vec3(0.5),edgeCol.rgb ,sharpIns*(1.0));

    float gray = dot(abs(edgeCol.rgb-0.5),vec3(0.299 ,0.587,0.114));
    // if(gray )
    vec3 resultCol = clamp(oriCol.rgb + (edgeCol.rgb-0.5)*2.0,0.0,1.0);
    vec4 lastCol = vec4(resultCol,oriCol.a);
    lastCol = takeEffectFilter(filterTex,lastCol,filterIns);
    gl_FragColor = vec4(lastCol);
    // gl_FragColor = vec4(texture2D(faceTex,uv).rgb,1.0);
}
