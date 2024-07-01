precision highp float;
varying highp vec2 uv0;
varying highp vec2 uv1;
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

vec4 lm_twirl(sampler2D tex,vec2 uv,vec2 center, float zoom, float radius,float angle)
{
    vec2 texSize=vec2(inputWidth,inputHeight);
    vec2 tc=uv*texSize;
    tc-=center;
    float dist=length(tc);
    if(dist<radius)
    {
        float percent=(radius-dist)/radius;
        if (progress > .5) percent = dist / radius;
        float theta = percent*radians(angle);

        if(progress<0.5)
            theta = -theta;
        float s=sin(theta);
        float c=cos(theta);
        
        tc=vec2(dot(tc,vec2(c,-s)),dot(tc,vec2(s,c)));
    }
    if (progress > .5) tc*=1.0-zoom*.5;
    tc+=center;
    tc=tc/texSize;
    vec4 resultColor=texture2D(tex,tc);
    return resultColor;
}

void main()
{
    vec2 t_screen_size=vec2(inputWidth,inputHeight);
    vec2 t_real_uv=uv0*t_screen_size;
    vec2 t_center=.5*t_screen_size;
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
    float zoom = t_progress;//pow(t_progress, .8);
    float radius = length(t_center)*(1.0+t_progress*0.55);
    float angle = 90.0*t_progress;

    gl_FragColor = lm_twirl(inputImageTexture,uv0,t_center,pow(zoom, .8),radius,angle);
}

