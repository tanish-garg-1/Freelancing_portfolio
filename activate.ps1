# Venv-style activation for this project's portable Node.
# Usage (from the project folder):  . .\activate.ps1
# After that, `node`, `npm`, and `npx` in this terminal use .node\ — nothing is installed globally.

$projectNode = Join-Path $PSScriptRoot ".node"
if (-not (Test-Path (Join-Path $projectNode "node.exe"))) {
    Write-Error "Portable Node not found at $projectNode"
    return
}

if (-not ($env:Path -split ";" | Where-Object { $_ -eq $projectNode })) {
    $env:Path = "$projectNode;$env:Path"
}
# Keep npm's global prefix and cache inside the project too.
$env:npm_config_prefix = $projectNode
$env:npm_config_cache = Join-Path $PSScriptRoot ".npm-cache"

Write-Host "Using project Node $(& node -v) / npm $(& npm -v) from $projectNode"
