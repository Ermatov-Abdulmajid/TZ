precision highp float;

uniform sampler2D inputImageTexture;
uniform sampler2D oriBlurTexture;
varying vec2 uv;
uniform vec4 u_ScreenParams;
uniform float blurSize;
float blendOverlay(float base, float blend) {
    return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
    return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}
float getWeight(int i ){
    if(i==0)
    return 0.3;
    else if(i==1)
    return 0.25;
    else if(i==2)
    return 0.2;
    else if(i==3)
    return 0.18;
    else if(i==4)
    return 0.16;
    else if(i==5)
    return 0.15;
    else if(i==6)
    return 0.1;
    else if(i==7)
    return 0.05;
    else if(i==8)
    return 0.02;
    else
    return 0.;
}
void main()
{
    vec2 mySize = u_ScreenParams.xy/min(u_ScreenParams.x,u_ScreenParams.y)*720.;
    vec2 offset = vec2(1,0)*vec2(blurSize)/mySize;

    // float half_gaussian_weight[9];
    
    // half_gaussian_weight[0]= 0.30;
    // half_gaussian_weight[1]= 0.25;
    // half_gaussian_weight[2]= 0.2;
    // half_gaussian_weight[3]= 0.18;
    // half_gaussian_weight[4]= 0.16;
    // half_gaussian_weight[5]= 0.15;
    // half_gaussian_weight[6]= 0.1;
    // half_gaussian_weight[7]= 0.05;
    // half_gaussian_weight[8]= 0.02;
    vec4 resultCol = texture2D(inputImageTexture, uv)*getWeight(0);
    float num = getWeight(0);
    for(int i = 1 ;i <= 8 ;i++){
        float j = float(i);
        resultCol+= texture2D(inputImageTexture, uv+j*offset)*getWeight(i);
        resultCol+= texture2D(inputImageTexture, uv-j*offset)*getWeight(i);
        num+=2.0*getWeight(i);
    }
    resultCol/=num;
    vec3 edge = texture2D(oriBlurTexture,uv).rgb-resultCol.rgb;
    float edgeGray = dot(abs(edge),vec3(0.299 ,0.587,0.114));
    edge*=smoothstep(0.0,0.05,edgeGray);
    edge = sign(edge)*pow(abs(edge),vec3(1.2));
    resultCol.rgb = (edge)*0.5+0.5;

    vec3 overlayCol = blendOverlay(resultCol.rgb,resultCol.rgb);
    overlayCol = blendOverlay(overlayCol.rgb,resultCol.rgb);
    overlayCol = blendOverlay(overlayCol.rgb,resultCol.rgb);
    overlayCol = blendOverlay(overlayCol.rgb,resultCol.rgb);
    gl_FragColor = vec4(overlayCol.rgb,resultCol.a);
}
