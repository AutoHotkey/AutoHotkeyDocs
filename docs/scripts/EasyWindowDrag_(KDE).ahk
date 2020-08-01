; Easy Window Dragging -- KDE style (based on the v1 script by Jonny) 
; https://www.autohotkey.com
; This script makes it much easier to move or resize a window: 1) Hold down
; the ALT key and LEFT-click anywhere inside a window to drag it to a new
; location; 2) Hold down ALT and RIGHT-click-drag anywhere inside a window
; to easily resize it; 3) Press ALT twice, but before releasing it the second
; time, left-click to minimize the window under the mouse cursor, right-click
; to maximize it, or middle-click to close it.

; The Double-Alt modifier is activated by pressing
; Alt twice, much like a double-click. Hold the second
; press down until you click.
;
; The shortcuts:
;  Alt + Left Button  : Drag to move a window.
;  Alt + Right Button : Drag to resize a window.
;  Double-Alt + Left Button   : Minimize a window.
;  Double-Alt + Right Button  : Maximize/Restore a window.
;  Double-Alt + Middle Button : Close a window.
;
; You can optionally release Alt after the first
; click rather than holding it down the whole time.

; This is the setting that runs smoothest on my
; system. Depending on your video card and cpu
; power, you may want to raise or lower this value.
SetWinDelay 2
CoordMode "Mouse"

global g_DoubleAlt := false

!LButton::
{
    if g_DoubleAlt
    {
        MouseGetPos ,, KDE_id
        ; This message is mostly equivalent to WinMinimize,
        ; but it avoids a bug with PSPad.
        PostMessage 0x112, 0xf020,,, KDE_id
        g_DoubleAlt := false
        return
    }
    ; Get the initial mouse position and window id, and
    ; abort if the window is maximized.
    MouseGetPos KDE_X1, KDE_Y1, KDE_id
    if WinGetMinMax(KDE_id)
        return
    ; Get the initial window position.
    WinGetPos KDE_WinX1, KDE_WinY1,,, KDE_id
    Loop
    {
        if !GetKeyState("LButton", "P") ; Break if button has been released.
            break
        MouseGetPos KDE_X2, KDE_Y2 ; Get the current mouse position.
        KDE_X2 -= KDE_X1 ; Obtain an offset from the initial mouse position.
        KDE_Y2 -= KDE_Y1
        KDE_WinX2 := (KDE_WinX1 + KDE_X2) ; Apply this offset to the window position.
        KDE_WinY2 := (KDE_WinY1 + KDE_Y2)
        WinMove KDE_WinX2, KDE_WinY2,,, KDE_id ; Move the window to the new position.
    }
}

!RButton::
{
    if g_DoubleAlt
    {
        MouseGetPos ,, KDE_id
        ; Toggle between maximized and restored state.
        if WinGetMinMax(KDE_id)
            WinRestore KDE_id
        Else
            WinMaximize KDE_id
        g_DoubleAlt := false
        return
    }
    ; Get the initial mouse position and window id, and
    ; abort if the window is maximized.
    MouseGetPos KDE_X1, KDE_Y1, KDE_id
    if WinGetMinMax(KDE_id)
        return
    ; Get the initial window position and size.
    WinGetPos KDE_WinX1, KDE_WinY1, KDE_WinW, KDE_WinH, KDE_id
    ; Define the window region the mouse is currently in.
    ; The four regions are Up and Left, Up and Right, Down and Left, Down and Right.
    if (KDE_X1 < KDE_WinX1 + KDE_WinW / 2)
        KDE_WinLeft := 1
    else
        KDE_WinLeft := -1
    if (KDE_Y1 < KDE_WinY1 + KDE_WinH / 2)
        KDE_WinUp := 1
    else
        KDE_WinUp := -1
    Loop
    {
        if !GetKeyState("RButton", "P") ; Break if button has been released.
            break
        MouseGetPos KDE_X2, KDE_Y2 ; Get the current mouse position.
        ; Get the current window position and size.
        WinGetPos KDE_WinX1, KDE_WinY1, KDE_WinW, KDE_WinH, KDE_id
        KDE_X2 -= KDE_X1 ; Obtain an offset from the initial mouse position.
        KDE_Y2 -= KDE_Y1
        ; Then, act according to the defined region.
        WinMove KDE_WinX1 + (KDE_WinLeft+1)/2*KDE_X2  ; X of resized window
              , KDE_WinY1 +   (KDE_WinUp+1)/2*KDE_Y2  ; Y of resized window
              , KDE_WinW  -     KDE_WinLeft  *KDE_X2  ; W of resized window
              , KDE_WinH  -       KDE_WinUp  *KDE_Y2  ; H of resized window
              , KDE_id
        KDE_X1 := (KDE_X2 + KDE_X1) ; Reset the initial position for the next iteration.
        KDE_Y1 := (KDE_Y2 + KDE_Y1)
    }
}

; "Alt + MButton" may be simpler, but I like an extra measure of security for
; an operation like this.
!MButton::
{
    if g_DoubleAlt
    {
        MouseGetPos ,, KDE_id
        WinClose KDE_id
        g_DoubleAlt := false
        return
    }
}

; This detects "double-clicks" of the alt key.
~Alt::
{
    g_DoubleAlt := (A_PriorHotkey = "~Alt" and A_TimeSincePriorHotkey < 400)
    Sleep 0
    KeyWait "Alt"  ; This prevents the keyboard's auto-repeat feature from interfering.
}
