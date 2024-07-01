precision highp float;
varying vec2 uv0;

uniform sampler2D inputImageTexture;
uniform int inputWidth;
uniform int inputHeight;
uniform float progress;

vec2 lm_cubic_bezier(vec2 p0, vec2 p1, vec2 p2, vec2 p3,float t)
{
    float t_inv = 1.0-t;
    float t_inv_2 = pow(t_inv,2.0);
    float t_inv_3 = pow(t_inv,3.0);
    float t_2 = pow(t,2.0);
    float t_3 = pow(t,3.0);
    vec2 p = p0*t_inv_3+3.0*p1*t*t_inv_2+3.0*p2*t_2*t_inv+p3*t_3;
    return p;
}

void main(void)
{
    float t_progress = progress*2.0;
    if(progress>.5)
    {
        t_progress = (1.0-progress)*2.0;
    }
    vec2 p0 = vec2(0.0);
    vec2 p3 = vec2(1.0);
    vec2 p1 = vec2(0.11, 0);
    vec2 p2 = vec2(0.5, 0);
    t_progress = lm_cubic_bezier(p0,p1,p2,p3,t_progress).y;

    vec2 direction = vec2(16., 0) * t_progress;
    vec2 baseTextureSize = vec2(inputWidth, inputHeight);
    lowp vec4 baseColor=texture2D(inputImageTexture,uv0);
    vec2 uv_unit = vec2(1.) / baseTextureSize;
    vec2 uv_offset = uv_unit * direction;
    vec2 uv1 = uv0 + uv_offset;
    lowp vec4 curColor = baseColor;
    lowp vec4 newColor = texture2D(inputImageTexture,uv1);
    lowp vec4 resultColor = curColor;
    resultColor.r = newColor.r;
    //resultColor.g = newColor.g;
    //resultColor.b = newColor.b;

    gl_FragColor = resultColor;
}