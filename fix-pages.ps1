$pages = @(
    'AboutUs.tsx',
    'Academics.tsx',
    'Admissions.tsx',
    'ContactUs.tsx',
    'Gallery.tsx',
    'Infrastructure.tsx',
    'NotFound.tsx'
)

$pages | ForEach-Object {
    $filePath = ".\src\pages\$_"
    
    $content = Get-Content -Path $filePath -Raw
    
    $content = $content -replace "import MainLayout from '../components/layout/MainLayout';\s*\n", ""
    
    $content = $content -replace "<MainLayout>\s*", ""
    $content = $content -replace "\s*</MainLayout>", ""
    
    $content = $content -replace "\n\s{4}<", "`n  <"
    
    # Save the file
    Set-Content -Path $filePath -Value $content
    
    Write-Host "Updated: $filePath"
}

Write-Host "All pages have been updated successfully!" -ForegroundColor Green
