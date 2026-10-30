param([string]$OutputDirectory = 'public/brand/identity-v1', [ValidateSet('v1','v2')][string]$AssetVersion = 'v1')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$destination = Join-Path $projectRoot $OutputDirectory
if (Test-Path -LiteralPath $destination) { throw "La carpeta de salida ya existe: $destination. Usa otro OutputDirectory." }
[void](New-Item -ItemType Directory -Path $destination)
$generated = 'C:\Users\agust\.codex\generated_images\01a1203c-e398-7671-af5d-3bb996d3835a'
$assets = @{
  'alpha-logo' = 'exec-1c5b85b2-6206-4fc5-9adc-6dd4a23c55b9.png'
  'alpha-logo-claro' = 'exec-09c16b61-0f85-4b93-bf19-055ba6fe732b.png'
  'alpha-isologotipo' = 'exec-2b4d3d63-7257-41d5-8739-7c7e09fb4565.png'
  'alpha-isologo-transparente' = 'exec-072c75dc-28c7-42ae-9dc2-7f51d5992450.png'
}
if ($AssetVersion -eq 'v2') {
  $assets = @{
    'alpha-logo' = 'exec-d16ddb92-e5c8-4888-9bcc-ce86379a1148.png'
    'alpha-logo-claro' = 'exec-31dd8b48-5e56-486c-b688-7be09ed311a3.png'
    'alpha-isologotipo' = 'exec-a4658683-d812-46a4-a56a-9465565968be.png'
    'alpha-isologo-transparente' = 'exec-c79b9666-9a92-480a-8257-3f5fe85144c7.png'
  }
}
$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$jpegOptions = [System.Drawing.Imaging.EncoderParameters]::new(1)
$jpegOptions.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]95)
function Export-Image([System.Drawing.Image]$Source, [string]$Name, [int]$Width, [int]$Height, [bool]$Transparent = $false) {
  $bitmap = [System.Drawing.Bitmap]::new($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    if ($Transparent) { $graphics.Clear([System.Drawing.Color]::Transparent) } else { $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#030B16')) }
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $scale = [Math]::Min($Width / $Source.Width, $Height / $Source.Height)
    $w = [int][Math]::Round($Source.Width * $scale)
    $h = [int][Math]::Round($Source.Height * $scale)
    $graphics.DrawImage($Source, [int](($Width-$w)/2), [int](($Height-$h)/2), $w, $h)
    $path = Join-Path $destination $Name
    if ($Name.EndsWith('.jpg')) { $bitmap.Save($path, $jpegEncoder, $jpegOptions) } else { $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png) }
  } finally { $graphics.Dispose(); $bitmap.Dispose() }
}
foreach ($name in $assets.Keys) {
  $source = Join-Path $generated $assets[$name]
  Copy-Item -LiteralPath $source -Destination (Join-Path $destination ($name + '.png'))
  $img = [System.Drawing.Image]::FromFile($source)
  try {
    if ($name -ne 'alpha-isologo-transparente') { Export-Image $img ($name + '.jpg') $img.Width $img.Height }
    if ($name -eq 'alpha-isologotipo') { Export-Image $img 'alpha-portada-1600x800.jpg' 1600 800 }
    if ($name -eq 'alpha-logo') { Export-Image $img 'alpha-perfil-marca-1080.jpg' 1080 1080 }
    if ($name -eq 'alpha-isologo-transparente') {
      Export-Image $img 'alpha-avatar-512.png' 512 512 $true
      Export-Image $img 'alpha-icono-192.png' 192 192 $true
      Export-Image $img 'alpha-favicon-64.png' 64 64 $true
      Export-Image $img 'alpha-favicon-32.png' 32 32 $true
    }
  } finally { $img.Dispose() }
}
$symbolSource = Join-Path $projectRoot 'public/brand/alpha-isologo.jpg'
if ($AssetVersion -eq 'v2') { $symbolSource = Join-Path $generated $assets['alpha-isologo-transparente'] }
$original = [System.Drawing.Image]::FromFile($symbolSource)
try { Export-Image $original 'alpha-isologo.jpg' $original.Width $original.Height } finally { $original.Dispose() }
Copy-Item -LiteralPath (Join-Path $projectRoot ("public/brand/identity-guide-$AssetVersion.md")) -Destination (Join-Path $destination 'LEEME-identidad.md')
$jpegOptions.Dispose()
Get-ChildItem -LiteralPath $destination | Select-Object Name, Length
