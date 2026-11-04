$ErrorActionPreference = "Stop"

$screenshotsDir = Join-Path $PSScriptRoot "screenshots"
if (!(Test-Path $screenshotsDir)) {
    New-Item -ItemType Directory -Path $screenshotsDir | Out-Null
}

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (!(Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}

$distHtml = (Get-Item (Join-Path $PSScriptRoot "frontend\dist\index.html")).FullName -replace '\\','/'
$userDataDir = Join-Path $PSScriptRoot "tmp_chrome_profile"

$routes = @(
    @{ Name = "01_dashboard.png"; Route = "#/dashboard" },
    @{ Name = "02_employees.png"; Route = "#/employees" },
    @{ Name = "03_departments.png"; Route = "#/departments" },
    @{ Name = "04_attendance.png"; Route = "#/attendance" },
    @{ Name = "05_leave_management.png"; Route = "#/leave" },
    @{ Name = "06_payroll.png"; Route = "#/payroll" },
    @{ Name = "07_reports.png"; Route = "#/reports" },
    @{ Name = "08_settings.png"; Route = "#/settings" },
    @{ Name = "09_login.png"; Route = "#/login" },
    @{ Name = "10_signup.png"; Route = "#/signup" }
)

Write-Host "Capturing application screenshots..."

foreach ($r in $routes) {
    $outFile = Join-Path $screenshotsDir $r.Name
    $url = "file:///$distHtml$($r.Route)"
    Write-Host "Capturing $($r.Name) from $($r.Route)..."
    
    $args = @(
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--hide-scrollbars",
        "--user-data-dir=`"$userDataDir`"",
        "--allow-file-access-from-files",
        "--disable-web-security",
        "--window-size=1440,900",
        "--virtual-time-budget=4000",
        "--screenshot=`"$outFile`"",
        "`"$url`""
    )
    
    Start-Process -FilePath $chromePath -ArgumentList ($args -join " ") -Wait
    
    if (Test-Path $outFile) {
        $size = (Get-Item $outFile).Length
        Write-Host " -> Saved: $($r.Name) ($size bytes)"
    } else {
        Write-Warning " -> Failed to capture $($r.Name)"
    }
}

Remove-Item -Recurse -Force $userDataDir -ErrorAction SilentlyContinue
Write-Host "All screenshots captured successfully!"

