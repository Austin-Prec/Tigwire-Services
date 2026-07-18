<#
  Deploys every Supabase edge function this site uses.

  Run this from the project root (the folder containing supabase/), e.g.:
      cd C:\path\to\TigwireServices-site
      .\deploy-functions.ps1

  What each function does:
    pages-write      - saves edits made in /admin/pages (this is the one
                        currently failing with "Failed to fetch" per the
                        conversation this script came from -- deploy this
                        one first if you just want to confirm the fix)
    articles-write    - publishing/editing blog posts in /admin
    articles-upload    - blog post cover photo uploads
    articles-list       - listing posts for /insights and the admin dashboard
    contact          - NOT currently called by the live site (ContactForm.tsx
                        posts to Formspree instead, per its own TODO comment).
                        Deployed here anyway since it's harmless to have
                        available, but you don't need it working for the
                        site itself to function.
#>

$ErrorActionPreference = "Stop"

function Write-Step($msg) {
    Write-Host ""
    Write-Host "== $msg ==" -ForegroundColor Cyan
}

function Test-CommandExists($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

# --- 1. Confirm the Supabase CLI is installed ---
Write-Step "Checking for Supabase CLI"
if (-not (Test-CommandExists "supabase")) {
    Write-Host "The 'supabase' command was not found." -ForegroundColor Red
    Write-Host "Install it first, then re-run this script. Options:"
    Write-Host "  - Scoop:    scoop install supabase"
    Write-Host "  - Or download the Windows binary from:"
    Write-Host "    https://github.com/supabase/cli/releases"
    exit 1
}
$version = supabase --version
Write-Host "Found Supabase CLI: $version"

# --- 2. Confirm we're in the right folder ---
Write-Step "Checking project structure"
if (-not (Test-Path "./supabase/functions")) {
    Write-Host "No supabase/functions folder found in the current directory." -ForegroundColor Red
    Write-Host "Run this script from the project root (the folder that contains 'supabase\')."
    Write-Host "Current directory: $(Get-Location)"
    exit 1
}

# --- 3. Confirm this project is linked to a real Supabase project ---
# Deploys will fail with a confusing error if this step is skipped, since
# the CLI won't know which project to push functions to.
Write-Step "Checking project link"
$linkCheck = supabase projects list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to the Supabase CLI, or unable to reach Supabase." -ForegroundColor Red
    Write-Host "Run 'supabase login' first, then re-run this script."
    exit 1
}
if (-not (Test-Path "./supabase/.temp/project-ref")) {
    Write-Host "This folder isn't linked to a Supabase project yet." -ForegroundColor Yellow
    Write-Host "Run this once, using the project ref from your Supabase dashboard"
    Write-Host "(Project Settings -> General -> Reference ID):"
    Write-Host ""
    Write-Host "    supabase link --project-ref YOUR_PROJECT_REF" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Then re-run this script."
    exit 1
}
$projectRef = Get-Content "./supabase/.temp/project-ref" -Raw
Write-Host "Linked to project: $($projectRef.Trim())"

# --- 4. Deploy each function, stopping immediately on the first failure ---
# so it's always clear which one broke, rather than deploying all five and
# leaving you to guess from a wall of output.
$functions = @("pages-write", "articles-write", "articles-upload", "articles-list", "contact")
$deployed = @()
$failed = $null

foreach ($fn in $functions) {
    Write-Step "Deploying $fn"
    supabase functions deploy $fn
    if ($LASTEXITCODE -ne 0) {
        $failed = $fn
        break
    }
    $deployed += $fn
}

# --- 5. Summary ---
Write-Step "Summary"
if ($deployed.Count -gt 0) {
    Write-Host "Deployed successfully:" -ForegroundColor Green
    foreach ($fn in $deployed) { Write-Host "  - $fn" }
}
if ($failed) {
    Write-Host "Stopped at '$failed' after a deploy error." -ForegroundColor Red
    Write-Host "Scroll up to see the actual error from the Supabase CLI above --"
    Write-Host "that message (not this summary) says what went wrong."
    exit 1
}

Write-Host ""
Write-Host "All functions deployed." -ForegroundColor Green
Write-Host "To confirm pages-write specifically fixed the 'Failed to fetch' error,"
Write-Host "reload /admin/pages in the browser and try saving a block again."
