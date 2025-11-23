<#
run-dev.ps1
Helper script to run the backend in development mode.

What it does:
 - Prompts for the MIGO API token (secure input). Sets `MIGO_API_TOKEN` in the current PowerShell session only.
 - Optionally enables the `dev` Spring profile (which uses H2 in-memory DB via `application-dev.properties`).
 - Runs `mvnw.cmd spring-boot:run` from the repository `backend` folder.

Security:
 - The script DOES NOT persist the token; it only sets it for the current session.
 - Do NOT commit tokens to source control.

Usage:
    Open PowerShell in the `backend` folder and run:
        .\run-dev.ps1
#>

Write-Host "Backend dev runner — sets MIGO token in session and starts Spring Boot (dev profile)."

# Prompt for token (secure)
$secureToken = Read-Host -Prompt "MIGO API token (leave empty to skip)" -AsSecureString
if ($secureToken -and $secureToken.Length -gt 0) {
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
    try {
        $plainToken = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
    $env:MIGO_API_TOKEN = $plainToken
    Write-Host "MIGO_API_TOKEN set for this session." -ForegroundColor Green
} else {
    Write-Host "No MIGO token provided; skipping." -ForegroundColor Yellow
}

# Ask whether to use dev profile (default: yes)
$useDev = Read-Host -Prompt "Use 'dev' Spring profile? (Y/n)"
if ([string]::IsNullOrWhiteSpace($useDev) -or $useDev.Trim().ToLower().StartsWith('y')) {
    $env:SPRING_PROFILES_ACTIVE = 'dev'
    Write-Host "SPRING_PROFILES_ACTIVE=dev (using application-dev.properties)" -ForegroundColor Green
} else {
    Write-Host "Leaving SPRING_PROFILES_ACTIVE unchanged." -ForegroundColor Yellow
}

Write-Host "Starting Spring Boot (mvnw). Use Ctrl+C to stop." -ForegroundColor Cyan

# Ensure we run from the backend folder where script lives
Push-Location (Split-Path -Parent $MyInvocation.MyCommand.Definition)
try {
    & .\mvnw.cmd spring-boot:run
} finally {
    Pop-Location
}
