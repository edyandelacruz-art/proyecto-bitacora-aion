$ErrorActionPreference = 'SilentlyContinue'

$tools = @(
  @{ Name = 'git'; Command = 'git --version' },
  @{ Name = 'node'; Command = 'node --version' },
  @{ Name = 'npm'; Command = 'npm --version' },
  @{ Name = 'python'; Command = 'python --version' },
  @{ Name = 'godot'; Command = 'godot --version' },
  @{ Name = 'ffmpeg'; Command = 'ffmpeg -version' }
)

Write-Host 'AION Forge Home Worker prerequisite check' -ForegroundColor Cyan
foreach ($tool in $tools) {
  $result = Invoke-Expression $tool.Command 2>$null | Select-Object -First 1
  if ($LASTEXITCODE -eq 0 -and $result) {
    Write-Host ('[OK]   {0}: {1}' -f $tool.Name, $result) -ForegroundColor Green
  } else {
    Write-Host ('[MISS] {0}' -f $tool.Name) -ForegroundColor Yellow
  }
}

Write-Host ''
Write-Host 'This script only inspects prerequisites. It installs nothing and changes no system settings.' -ForegroundColor DarkGray
