$ErrorActionPreference = 'Continue'
$git = 'C:\Users\espan\.gemini\tools\git\cmd\git.exe'

# Remove setup script
if (Test-Path 'setup-git.ps1') { Remove-Item 'setup-git.ps1' -Force }

Write-Host "Initializing git repository..."
& $git init

# Configure git user if not present
$userName = & $git config user.name
if (-not $userName) {
    & $git config user.name "akhilneeraj33"
    & $git config user.email "akhilneeraj33@users.noreply.github.com"
}

Write-Host "Staging files..."
& $git add .

Write-Host "Creating initial commit..."
& $git commit -m "feat: Autonomous Pothole Mapping & Automated Filling System IoT dashboard"

Write-Host "Setting remote origin..."
& $git remote remove origin 2>$null
& $git remote add origin https://github.com/akhilneeraj33/Autonomous-pothole-mapping.git

Write-Host "Renaming branch to main..."
& $git branch -M main

Write-Host "Pushing to origin main..."
& $git push -u origin main
