local exports = exports or {}
local SmoothV12 = SmoothV12 or {}
SmoothV12.__index = SmoothV12

-- output
local FACE_ADJUST = "face_adjust"
local FACE_ADJUST_INTENSITY = "intensity"

-- runtime
local MIN = math.min
local MAX = math.max
local MOD = math.modf
local EPSC = 0.001
local SEGMENT_ID = "segmentId"
local LOG_TAG = "AE_EFFECT_TAG SmoothV12.lua"

function SmoothV12.new(construct, ...)
    local self = setmetatable({}, SmoothV12)

    self.maxFaceNum = 10
    self.maxDisplayNum = 6

    self.intensity = 0
    self.width = -1
    self.height = -1

    return self
end

function SmoothV12:onStart(comp, script)
    local scene = script.scene
    local scriptSystem = scene:getSystem("ScriptSystem")
    scriptSystem:clearAllEventType()
    scriptSystem:addEventType(Amaz.AppEventType.SetEffectIntensity)

    self.scriptProps = comp.properties
    local segmentId = self.scriptProps:get(SEGMENT_ID)
    if segmentId ~= nil then
        self.logTag = string.format('%s %s', LOG_TAG, segmentId)
    else
        self.logTag = LOG_TAG
    end

    local smoothEntity = scene:findEntityBy("SmoothV12")
    local smoothResource = smoothEntity:getComponent("TableComponent").table
    self.makeupMaterial = smoothResource:get("makeup_material")
    self.hsvMaterial = smoothResource:get("hsv_material")
    self.blur1Material = smoothResource:get("blur1_material")
    self.blur2Material = smoothResource:get("blur2_material")
    self.blendMaterial = smoothResource:get("blend_material")
    self.blur3Material = smoothResource:get("blur3_material")
    self.blur4Material = smoothResource:get("blur4_material")
    self.blend2Material = smoothResource:get("blend2_material")
    self.makeupMesh = smoothResource:get("makeup_mesh")
    self.blitMesh = smoothResource:get("blit_mesh")
    self.inputTex = smoothResource:get("input_texture")
    self.makeupRT = smoothResource:get("makeup_rt")
    self.blur1RT = smoothResource:get("blur1_rt")
    self.blur2RT = smoothResource:get("blur2_rt")
    self.blendRT = smoothResource:get("blend_rt")
    self.outputRT = smoothResource:get("output_rt")

    self:initCommandBuffer()
end

function SmoothV12:initCommandBuffer()
    self.commandBufStatic = Amaz.CommandBuffer()
    self.commandBufZero = Amaz.CommandBuffer()

    self.meshTool = Amaz.AMGFaceMeshUtils()
    self.meshType = Amaz.AMGBeautyMeshType.FACE145
    self.meshTool:setMesh(self.makeupMesh, self.meshType)

    self.skinsegTex = Amaz.Texture2D()
    self.hsvMaterial:setTex("skinsegTexture", self.skinsegTex)
    self.blend2Material:setTex("skinsegTexture", self.skinsegTex)

    self.indicesCount = 768
    self.identityMatrix = Amaz.Matrix4x4f():SetIdentity()
    self.clearColor = Amaz.Color(0, 0, 0, 0)

    --makeup -- pass 1
    self:initPass(self.commandBufStatic, self.blur2RT, self.makeupMesh, self.makeupMaterial)
    --hsv -- pass 2
    self:initPass(self.commandBufStatic, self.makeupRT, self.blitMesh, self.hsvMaterial)
    --blur1 -- pass 3
    self:initPass(self.commandBufStatic, self.blur1RT, self.blitMesh, self.blur1Material)
    --blur2 -- pass 4
    self:initPass(self.commandBufStatic, self.blur2RT, self.blitMesh, self.blur2Material)
    --blend -- pass 5
    self:initPass(self.commandBufStatic, self.blendRT, self.blitMesh, self.blendMaterial)
    --blur3 -- pass 6
    self:initPass(self.commandBufStatic, self.blur1RT, self.blitMesh, self.blur3Material)
    --blur4 -- pass 7
    self:initPass(self.commandBufStatic, self.blur2RT, self.blitMesh, self.blur4Material)
    --blend2 -- pass 8
    self:initPass(self.commandBufStatic, self.outputRT, self.blitMesh, self.blend2Material)
end

function SmoothV12:initPass(cmdbuf, rt, mesh, material)
    cmdbuf:setRenderTexture(rt)
    cmdbuf:clearRenderTexture(true, true, self.clearColor)
    cmdbuf:drawMesh(mesh, self.identityMatrix, material, 0, 0, nil, true)
end

function SmoothV12:onUpdate(comp, deltaTime)
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()
    local segInfo = result:getSkinSegInfo()

    if self.intensity > EPSC and (faceCount > 0 or segInfo ~= nil) then
        local displayCount = MIN(faceCount, self.maxDisplayNum)
        for i = 0, displayCount - 1 do
            local points_array = result:getFaceBaseInfo(i).points_array
            self.meshTool:updateMeshWithFaceData106(self.meshType, points_array, i)
        end
        self.makeupMesh:getSubMesh(0).indicesCount = displayCount * self.indicesCount

        if segInfo ~= nil then
            local segImage = segInfo.data
            self.skinsegTex:storage(segImage)
        end

        self.hsvMaterial:setFloat("hasFaceFlag", (faceCount > 0))
        self.hsvMaterial:setFloat("intensity", self.intensity)
        self:updateInputSize()

        self.outputRT.inputTexture = nil
        comp.entity.scene:commitCommandBuffer(self.commandBufStatic)
    else
        self.outputRT.inputTexture = self.inputTex
    end
end

function SmoothV12:updateInputSize()
    local width = self.outputRT.width
    local height = self.outputRT.height
    if width ~= self.width or height ~= self.height then
        self.width = width
        self.height = height

        local mvpMatrix = Amaz.Matrix4x4f()
        mvpMatrix:SetTranslate(Amaz.Vector3f(-1, -1, 0))
        mvpMatrix:Scale(Amaz.Vector3f(2, 2, 1))
        mvpMatrix:Translate(Amaz.Vector3f(0, 1, 0))
        mvpMatrix:Scale(Amaz.Vector3f(1, -1, 1))
        mvpMatrix:Scale(Amaz.Vector3f(1 / width, 1 / height, 1))
        self.makeupMaterial:setMat4("uMVPMatrix", mvpMatrix)

        local widthOffset = 1 / self.blur1RT.width
        local heightOffset = 1 / self.blur1RT.height
        self.blur1Material:setFloat("texBlurWidthOffset", widthOffset)
        self.blur2Material:setFloat("texBlurHeightOffset", heightOffset)
        self.blur3Material:setFloat("widthOffset", widthOffset)
        self.blur3Material:setFloat("heightOffset", heightOffset)
        self.blur4Material:setFloat("widthOffset", widthOffset)
        self.blur4Material:setFloat("heightOffset", heightOffset)
    end
end

function SmoothV12:onEvent(comp, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        self:handleIntensityEvent(comp, event.args)
    end
end

function SmoothV12:handleIntensityEvent(comp, args)
    local inputKey = args:get(0)
    local inputValue = args:get(1)
    Amaz.LOGS(self.logTag, "handleIntensityEvent set " .. inputKey)

    if inputKey == FACE_ADJUST then
        local inputSize = inputValue:size()
        if inputSize > 0 then
            local inputMap = inputValue:get(0)
            self.intensity = inputMap:get(FACE_ADJUST_INTENSITY)
        end
    end
end

exports.SmoothV12 = SmoothV12
return exports