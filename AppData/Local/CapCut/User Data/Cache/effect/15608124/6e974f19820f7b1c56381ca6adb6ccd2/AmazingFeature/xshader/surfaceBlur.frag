precision highp float;

uniform sampler2D inputImageTexture;
varying vec2 uv;

uniform vec4 u_ScreenParams;
uniform float radius;
uniform float T;
uniform float blurStep;

vec3 getWeight(vec3 Col1,vec3 Col2,float T)
{
    return max(1.-abs(Col1-Col2)/(2.5*T),0.);
}
vec4 blur(sampler2D inputTexture,vec2 textureCoordinate, float blurRadius, float stepUV, vec2 screenSize,float T)
{
    vec2 unitUV = vec2(stepUV,stepUV)/screenSize;
    vec4 oriCol = texture2D(inputTexture,textureCoordinate);
    vec4 midCol;
    vec3 midweight;
    vec4 sumColor=vec4(0.);
    vec3 sumWeight=vec3(0.0);
    vec2 textureCoordinateA;
    vec2 textureCoordinateB;
    vec4 colorA;
    vec4 colorB;
    vec3 weightA;
    vec3 weightB;
    for(int p=-7;p<=7;p++){
        float j = float(p);
        if(j>blurRadius||j<-blurRadius){
            continue;
        }
        midCol=texture2D(inputTexture,textureCoordinate+vec2(j,0)*unitUV);
        midweight=getWeight(oriCol.rgb,midCol.rgb,T);
        sumColor.rgb+=midCol.rgb*midweight;
        sumWeight+=midweight;
        for(int q=1;q<=7;q++)
        {
            float i = float(q);
            if(i>blurRadius){
            break;
            }
            textureCoordinateA = textureCoordinate+vec2(j,i)*unitUV;
            textureCoordinateB = textureCoordinate+vec2(j,-i)*unitUV;
            colorA = texture2D(inputTexture,textureCoordinateA);
            colorB = texture2D(inputTexture,textureCoordinateB);
            weightA = getWeight(oriCol.rgb,colorA.rgb,T);
            weightB = getWeight(oriCol.rgb,colorB.rgb,T);
            sumColor.rgb += colorA.rgb*weightA;
            sumColor.rgb += colorB.rgb*weightB;
            sumWeight+= weightA+weightB;
        }
    }
    vec3 resultCol = clamp(sumColor.rgb/sumWeight,0.,1.);
    return vec4(resultCol,oriCol.a);
}

void main()
{
    vec2 mySize = u_ScreenParams.xy/min(u_ScreenParams.x,u_ScreenParams.y)*720.;
    vec2 screenSize=mySize;
    vec4 col = blur(inputImageTexture,uv,radius,blurStep, screenSize,T/255.);

    gl_FragColor = vec4(col);
}
