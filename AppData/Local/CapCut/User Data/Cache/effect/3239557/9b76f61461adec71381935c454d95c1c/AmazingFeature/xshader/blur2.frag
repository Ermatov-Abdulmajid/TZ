precision mediump float;

uniform sampler2D inputImageTexture; 
varying highp vec2 textureCoordinate; 

varying highp vec4 textureShift_1; 
varying highp vec4 textureShift_2; 
varying highp vec4 textureShift_3; 
varying highp vec4 textureShift_4; 

uniform sampler2D faceMaskTexture;

void main() { 
    vec4 curColor = texture2D(inputImageTexture, textureCoordinate);
    float skinArea = texture2D(faceMaskTexture, textureCoordinate).a;

    float tolerance_factor = 5.2486386;

    if (skinArea > 0.1) {
        mediump float sum_weight; 
        mediump vec3 sum; 
        mediump float sum_g;
        mediump vec4 neighborColor;
        mediump float color_dist; 
        mediump float sample_weight; 
        sum_weight = 0.18; 
        sum = curColor.rgb * 0.18; 
        sum_g = curColor.g;

        neighborColor = texture2D(inputImageTexture, textureShift_1.xy); 
        color_dist = min(distance(curColor.rgb, neighborColor.rgb) * tolerance_factor, 1.0); 
        sample_weight = 0.15 * (1.0 - color_dist); 
        sum_weight += sample_weight; 
        sum += neighborColor.rgb * sample_weight; 
        sum_g += neighborColor.g;
        
        neighborColor = texture2D(inputImageTexture, textureShift_1.zw); 
        color_dist = min(distance(curColor.rgb, neighborColor.rgb) * tolerance_factor, 1.0); 
        sample_weight = 0.15 * (1.0 - color_dist); 
        sum_weight += sample_weight; 
        sum += neighborColor.rgb * sample_weight; 
        sum_g += neighborColor.g;
        
        neighborColor = texture2D(inputImageTexture, textureShift_2.xy); 
        color_dist = min(distance(curColor.rgb, neighborColor.rgb) * tolerance_factor, 1.0); 
        sample_weight = 0.12 * (1.0 - color_dist); 
        sum_weight += sample_weight; 
        sum += neighborColor.rgb * sample_weight; 
        sum_g += neighborColor.g;
        
        neighborColor = texture2D(inputImageTexture, textureShift_2.zw); 
        color_dist = min(distance(curColor.rgb, neighborColor.rgb) * tolerance_factor, 1.0); 
        sample_weight = 0.12 * (1.0 - color_dist); 
        sum_weight += sample_weight; 
        sum += neighborColor.rgb * sample_weight; 
        sum_g += neighborColor.g;

        neighborColor = texture2D(inputImageTexture, textureShift_3.xy); 
        color_dist = min(distance(curColor.rgb, neighborColor.rgb) * tolerance_factor, 1.0); 
        sample_weight = 0.09 * (1.0 - color_dist); 
        sum_weight += sample_weight; 
        sum += neighborColor.rgb * sample_weight; 
        sum_g += neighborColor.g;
        
        neighborColor = texture2D(inputImageTexture, textureShift_3.zw); 
        color_dist = min(distance(curColor.rgb, neighborColor.rgb) * tolerance_factor, 1.0); 
        sample_weight = 0.09 * (1.0 - color_dist); 
        sum_weight += sample_weight; 
        sum += neighborColor.rgb * sample_weight; 
        sum_g += neighborColor.g;

        neighborColor = texture2D(inputImageTexture, textureShift_4.xy); 
        color_dist = min(distance(curColor.rgb, neighborColor.rgb) * tolerance_factor, 1.0); 
        sample_weight = 0.05 * (1.0 - color_dist); 
        sum_weight += sample_weight; 
        sum += neighborColor.rgb * sample_weight; 
        sum_g += neighborColor.g;

        neighborColor = texture2D(inputImageTexture, textureShift_4.zw); 
        color_dist = min(distance(curColor.rgb, neighborColor.rgb) * tolerance_factor, 1.0); 
        sample_weight = 0.05 * (1.0 - color_dist); 
        sum_weight += sample_weight;         
        sum += neighborColor.rgb * sample_weight; 
        sum_g += neighborColor.g;

        // co-variance
        mediump float varColor = (curColor.g - sum_g * 0.1111) * 7.07;
        varColor = min(varColor * varColor, 1.0);

        if (sum_weight < 0.4) { 
            gl_FragColor = vec4(curColor.rgb, varColor); 
        } 
        else if (sum_weight < 0.5) 
        { 
            gl_FragColor = vec4(mix(curColor.rgb, sum / sum_weight, (sum_weight - 0.4) / 0.1), varColor); 
        } 
        else 
        { 
            gl_FragColor = vec4(sum / sum_weight, varColor); 
        } 
    } 
    else 
    { 
        gl_FragColor = curColor; 
    } 
}