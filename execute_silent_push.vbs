Set objShell = CreateObject("WScript.Shell")
strPath = "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site\RUN_PUSH_NOW.bat"
objShell.Run strPath, 0, True
WScript.Echo "Push completed"
