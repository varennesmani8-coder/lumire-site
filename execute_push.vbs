Dim shell, fso, objFile, result
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Change to repo directory and execute git commands
shell.CurrentDirectory = "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"

' Execute git configuration and push
result = shell.Run("cmd /k title Git Push && git config user.email mangi@example.com && git config user.name ""Claude Code"" && git remote remove origin 2>nul && git remote add origin ""https://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@github.com/varennesmani8-coder/lumire-site.git"" && git push -u origin main --force", 1, True)

WScript.Quit result
