--write by editor  EffectSDK:12.7.0 EngineVersion:12.7.0 EditorBuildTime:Nov__2_2022_09_58_45
--sliderVersion: 20210901  Lua generation date: Fri Mar  3 17:02:18 2023


local exports = exports or {}
local ImageBusinessSlider = ImageBusinessSlider or {}
ImageBusinessSlider.__index = ImageBusinessSlider


function ImageBusinessSlider.new(construct, ...)
    local self = setmetatable({}, ImageBusinessSlider)
    if construct and ImageBusinessSlider.constructor then
        ImageBusinessSlider.constructor(self, ...)
    end
    return self
end


local function remap(x, a, b)
    return x * (b - a) + a
end


function ImageBusinessSlider:onStart(sys)
    self.resultMaterial0 = sys.scene:findEntityBy("result"):getComponent("Renderer").material
    self.blur2Material1 = sys.scene:findEntityBy("blur2"):getComponent("Renderer").material
    self.blur3_edgeMaterial2 = sys.scene:findEntityBy("blur3_edge"):getComponent("Renderer").material
    self.surfaceBlurMaterial3 = sys.scene:findEntityBy("surfaceBlur"):getComponent("Renderer").material
    self.blur1Material4 = sys.scene:findEntityBy("blur1"):getComponent("Renderer").material
    self.blur0Material5 = sys.scene:findEntityBy("blur0"):getComponent("Renderer").material
end


function ImageBusinessSlider:onEvent(sys,event)
    if event.args:get(0) == "effects_adjust_range" then
        local intensity = event.args:get(1)
        self.resultMaterial0["whiteEdgeIns"] = remap(intensity,2,0)
        self.resultMaterial0["blackEdgeIns"] = remap(intensity,0,2)
    end
    if event.args:get(0) == "effects_adjust_sharpen" then
        local intensity = event.args:get(1)
        self.blur2Material1["blurSize"] = remap(intensity,0,4.5)
        self.blur3_edgeMaterial2["blurSize"] = remap(intensity,0,4.5)
    end
    if event.args:get(0) == "effects_adjust_filter" then
        local intensity = event.args:get(1)
        self.resultMaterial0["filterIns"] = remap(intensity,0,1)
    end
    if event.args:get(0) == "effects_adjust_blur" then
        local intensity = event.args:get(1)
        self.surfaceBlurMaterial3["T"] = remap(intensity,0.001,10)
        self.blur1Material4["blurSize"] = remap(intensity,0,0.2)
        self.blur0Material5["blurSize"] = remap(intensity,0,0.2)
    end
end


exports.ImageBusinessSlider = ImageBusinessSlider
return exports