; Using a Joystick as a Mouse
; https://www.autohotkey.com
; This script converts a joystick into a three-button mouse.  It allows each
; button to drag just like a mouse button and it uses virtually no CPU time.
; Also, it will move the cursor faster depending on how far you push the joystick
; from center. You can personalize various settings at the top of the script.

; Increase the following value to make the mouse cursor move faster:
JoyMultiplier := 0.30

; Decrease the following value to require less joystick displacement-from-center
; to start moving the mouse.  However, you may need to calibrate your joystick
; -- ensuring it's properly centered -- to avoid cursor drift. A perfectly tight
; and centered joystick could use a value of 1:
JoyThreshold := 3

; Change the following to true to invert the Y-axis, which causes the mouse to
; move vertically in the direction opposite the stick:
InvertYAxis := false

; Change these values to use joystick button numbers other than 1, 2, and 3 for
; the left, right, and middle mouse buttons.  Available numbers are 1 through 32.
; Use the Joystick Test Script to find out your joystick's numbers more easily.
ButtonLeft := 1
ButtonRight := 2
ButtonMiddle := 3

; If your joystick has a POV control, you can use it as a mouse wheel.  The
; following value is the number of milliseconds between turns of the wheel.
; Decrease it to have the wheel turn faster:
WheelDelay := 250

; If your system has more than one joystick, increase this value to use a joystick
; other than the first:
JoystickNumber := 1

; END OF CONFIG SECTION -- Don't change anything below this point unless you want
; to alter the basic nature of the script.

#SingleInstance

JoystickPrefix := JoystickNumber "Joy"
Hotkey JoystickPrefix . ButtonLeft, ClickButtonLeft
Hotkey JoystickPrefix . ButtonRight, ClickButtonRight
Hotkey JoystickPrefix . ButtonMiddle, ClickButtonMiddle

; Calculate the axis displacements that are needed to start moving the cursor:
JoyThresholdUpper := 50 + JoyThreshold
JoyThresholdLower := 50 - JoyThreshold
if InvertYAxis
    YAxisMultiplier := -1
else
    YAxisMultiplier := 1

SetTimer WatchJoystick, 10  ; Monitor the movement of the joystick.

JoyInfo := GetKeyState(JoystickNumber "JoyInfo")
if InStr(JoyInfo, "P")  ; Joystick has POV control, so use it as a mouse wheel.
    SetTimer MouseWheel, WheelDelay

; The functions below do not use KeyWait because that would sometimes trap the
; WatchJoystick quasi-thread beneath the wait-for-button-up thread, which would
; effectively prevent mouse-dragging with the joystick.

ClickButtonLeft(*)
{
    SetMouseDelay -1  ; Makes movement smoother.
    MouseClick "Left",,, 1, 0, "D"  ; Hold down the left mouse button.
    SetTimer WaitForLeftButtonUp, 10
    
    WaitForLeftButtonUp()
    {
        if GetKeyState(A_ThisHotkey)
            return  ; The button is still, down, so keep waiting.
        ; Otherwise, the button has been released.
        SetTimer , 0
        SetMouseDelay -1  ; Makes movement smoother.
        MouseClick "Left",,, 1, 0, "U"  ; Release the mouse button.
    }
}

ClickButtonRight(*)
{
    SetMouseDelay -1  ; Makes movement smoother.
    MouseClick "Right",,, 1, 0, "D"  ; Hold down the right mouse button.
    SetTimer WaitForRightButtonUp, 10
    
    WaitForRightButtonUp()
    {
        if GetKeyState(A_ThisHotkey)
            return  ; The button is still, down, so keep waiting.
        ; Otherwise, the button has been released.
        SetTimer , 0
        MouseClick "Right",,, 1, 0, "U"  ; Release the mouse button.
    }
}

ClickButtonMiddle(*)
{
    SetMouseDelay -1  ; Makes movement smoother.
    MouseClick "Middle",,, 1, 0, "D"  ; Hold down the right mouse button.
    SetTimer WaitForMiddleButtonUp, 10
    
    WaitForMiddleButtonUp()
    {
        if GetKeyState(A_ThisHotkey)
            return  ; The button is still, down, so keep waiting.
        ; Otherwise, the button has been released.
        SetTimer , 0
        MouseClick "Middle",,, 1, 0, "U"  ; Release the mouse button.
    }

}

WatchJoystick()
{
    global
    MouseNeedsToBeMoved := false  ; Set default.
    joyx := GetKeyState(JoystickNumber "JoyX")
    joyy := GetKeyState(JoystickNumber "JoyY")
    if joyx > JoyThresholdUpper
    {
        MouseNeedsToBeMoved := true
        DeltaX := Round(joyx - JoyThresholdUpper)
    }
    else if joyx < JoyThresholdLower
    {
        MouseNeedsToBeMoved := true
        DeltaX := Round(joyx - JoyThresholdLower)
    }
    else
        DeltaX := 0
    if joyy > JoyThresholdUpper
    {
        MouseNeedsToBeMoved := true
        DeltaY := Round(joyy - JoyThresholdUpper)
    }
    else if joyy < JoyThresholdLower
    {
        MouseNeedsToBeMoved := true
        DeltaY := Round(joyy - JoyThresholdLower)
    }
    else
        DeltaY := 0
    if MouseNeedsToBeMoved
    {
        SetMouseDelay -1  ; Makes movement smoother.
        MouseMove DeltaX * JoyMultiplier, DeltaY * JoyMultiplier * YAxisMultiplier, 0, "R"
    }
}

MouseWheel()
{
    global
    JoyPOV := GetKeyState(JoystickNumber "JoyPOV")
    if JoyPOV = -1  ; No angle.
        return
    if (JoyPOV > 31500 or JoyPOV < 4500)  ; Forward
        Send "{WheelUp}"
    else if JoyPOV >= 13500 and JoyPOV <= 22500  ; Back
        Send "{WheelDown}"
}
