; Using a Controller as a Mouse
; https://www.autohotkey.com
; This script converts a controller (gamepad, joystick, etc.) into a three-button
; mouse. It allows each button to drag just like a mouse button and it uses
; virtually no CPU time. Also, it will move the cursor faster depending on how far
; you push the controller from center. You can personalize various settings at the
; top of the script.
;
; Note: For Xbox controller 2013 and newer (anything newer than the Xbox 360
; controller), this script will only work if a window it owns is active,
; such as a message box, GUI, or the script's main window.

; Increase the following value to make the mouse cursor move faster:
ContMultiplier := 0.30

; Decrease the following value to require less controller displacement-from-center
; to start moving the mouse.  However, you may need to calibrate your controller
; -- ensuring it's properly centered -- to avoid cursor drift. A perfectly tight
; and centered controller could use a value of 1:
ContThreshold := 3

; Change the following to true to invert the Y-axis, which causes the mouse to
; move vertically in the direction opposite the stick:
InvertYAxis := false

; Change these values to use controller button numbers other than 1, 2, and 3 for
; the left, right, and middle mouse buttons.  Available numbers are 1 through 32.
; Use the Controller Test Script to find out your controller's numbers more easily.
ButtonLeft := 1
ButtonRight := 2
ButtonMiddle := 3

; If your controller has a POV control, you can use it as a mouse wheel.  The
; following value is the number of milliseconds between turns of the wheel.
; Decrease it to have the wheel turn faster:
WheelDelay := 250

; If your system has more than one controller, increase this value to use a
; controller other than the first:
ControllerNumber := 1

; END OF CONFIG SECTION -- Don't change anything below this point unless you want
; to alter the basic nature of the script.

#SingleInstance

ControllerPrefix := ControllerNumber "Joy"
Hotkey ControllerPrefix . ButtonLeft, ClickButtonLeft
Hotkey ControllerPrefix . ButtonRight, ClickButtonRight
Hotkey ControllerPrefix . ButtonMiddle, ClickButtonMiddle

; Calculate the axis displacements that are needed to start moving the cursor:
ContThresholdUpper := 50 + ContThreshold
ContThresholdLower := 50 - ContThreshold
if InvertYAxis
    YAxisMultiplier := -1
else
    YAxisMultiplier := 1

SetTimer WatchController, 10  ; Monitor the movement of the controller.

JoyInfo := GetKeyState(ControllerNumber "JoyInfo")
if InStr(JoyInfo, "P")  ; Controller has POV control, so use it as a mouse wheel.
    SetTimer MouseWheel, WheelDelay

; The functions below do not use KeyWait because that would sometimes trap the
; WatchController quasi-thread beneath the wait-for-button-up thread, which would
; effectively prevent mouse-dragging with the controller.

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

WatchController()
{
    global
    MouseNeedsToBeMoved := false  ; Set default.
    JoyX := GetKeyState(ControllerNumber "JoyX")
    JoyY := GetKeyState(ControllerNumber "JoyY")
    if JoyX > ContThresholdUpper
    {
        MouseNeedsToBeMoved := true
        DeltaX := Round(JoyX - ContThresholdUpper)
    }
    else if JoyX < ContThresholdLower
    {
        MouseNeedsToBeMoved := true
        DeltaX := Round(JoyX - ContThresholdLower)
    }
    else
        DeltaX := 0
    if JoyY > ContThresholdUpper
    {
        MouseNeedsToBeMoved := true
        DeltaY := Round(JoyY - ContThresholdUpper)
    }
    else if JoyY < ContThresholdLower
    {
        MouseNeedsToBeMoved := true
        DeltaY := Round(JoyY - ContThresholdLower)
    }
    else
        DeltaY := 0
    if MouseNeedsToBeMoved
    {
        SetMouseDelay -1  ; Makes movement smoother.
        MouseMove DeltaX * ContMultiplier, DeltaY * ContMultiplier * YAxisMultiplier, 0, "R"
    }
}

MouseWheel()
{
    global
    JoyPOV := GetKeyState(ControllerNumber "JoyPOV")
    if JoyPOV = -1  ; No angle.
        return
    if (JoyPOV > 31500 or JoyPOV < 4500)  ; Forward
        Send "{WheelUp}"
    else if JoyPOV >= 13500 and JoyPOV <= 22500  ; Back
        Send "{WheelDown}"
}
