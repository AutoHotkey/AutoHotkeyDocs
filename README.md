#NoEnv
#SingleInstance Force
SetBatchLines, -1
SetKeyDelay, -1
SetMouseDelay, -1
SetWinDelay, -1
SetControlDelay, -1
CoordMode, Mouse, Screen

F1::
    ; เก็บตำแหน่งเมาส์เดิม
    MouseGetPos, ox, oy

    ; โฟกัส Chrome (ไม่รอ)
    WinActivate, ahk_exe chrome.exe

    ; คลิกช่องพิมพ์ (no animation)
    FastClick(358, 955)

    ; ส่งข้อความ (burst)
    SendInput {Text}รับทราบค่ะ ทำรายการสักครู่นะคะ🙏 
    SendInput {Enter down}{Enter up}

    ; คืนตำแหน่งเมาส์
    DllCall("SetCursorPos", "int", ox, "int", oy)
return

FastClick(x, y) {
    DllCall("SetCursorPos", "int", x, "int", y)
    DllCall("mouse_event", "UInt", 2) ; left down
    DllCall("mouse_event", "UInt", 4) ; left up
}
