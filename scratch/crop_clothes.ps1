Add-Type -AssemblyName System.Drawing

function Crop-Rect($src, $rect, $outPath) {
    $dest = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $destRect = [System.Drawing.Rectangle]::new(0, 0, $rect.Width, $rect.Height)
    $g.DrawImage($src, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $dest.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $dest.Dispose()
}

$clothesDir = 'D:\EXE-Myfitdaily\Web\frontend\public\assets\clothes'
if (!(Test-Path $clothesDir)) { New-Item -ItemType Directory -Path $clothesDir -Force | Out-Null }

$tplDir = 'D:\EXE-Myfitdaily\Web\frontend\public\assets\templates'

# Top items crop: y ~36 to 108, x ~16 to 104 (w: 88, h: 72)
$topCrops = @(
    @{ Set = 1; Name = 'shirt_white_formal.jpg' },
    @{ Set = 2; Name = 'shirt_oxford_light_blue.jpg' },
    @{ Set = 3; Name = 'shirt_black_formal.jpg' },
    @{ Set = 4; Name = 'shirt_stripe_blue_real.jpg' },
    @{ Set = 5; Name = 'shirt_linen_white.jpg' },
    @{ Set = 6; Name = 'shirt_denim_blue.jpg' },
    @{ Set = 13; Name = 'shirt_longsleeve_stripe.jpg' },
    @{ Set = 14; Name = 'hoodie_grey.jpg' },
    @{ Set = 15; Name = 'shirt_white_classic.jpg' }
)

foreach ($tc in $topCrops) {
    $boxPath = "$tplDir\set_$($tc.Set)_top_box.jpg"
    if (Test-Path $boxPath) {
        $bmp = [System.Drawing.Bitmap]::new($boxPath)
        Crop-Rect $bmp ([System.Drawing.Rectangle]::new(14, 34, 92, 74)) "$clothesDir\$($tc.Name)"
        $bmp.Dispose()
    }
}

# Bot items crop: y ~36 to 122, x ~24 to 96 (w: 72, h: 86)
$botCrops = @(
    @{ Set = 1; Name = 'pants_trousers_black.jpg' },
    @{ Set = 2; Name = 'pants_wide_beige.jpg' },
    @{ Set = 3; Name = 'pants_trousers_grey.jpg' },
    @{ Set = 4; Name = 'pants_trousers_navy.jpg' },
    @{ Set = 5; Name = 'pants_wide_beige_light.jpg' },
    @{ Set = 6; Name = 'pants_wide_black.jpg' },
    @{ Set = 13; Name = 'pants_wide_navy.jpg' },
    @{ Set = 14; Name = 'pants_jogger_black.jpg' },
    @{ Set = 15; Name = 'pants_trousers_beige.jpg' }
)

foreach ($bc in $botCrops) {
    $boxPath = "$tplDir\set_$($bc.Set)_bot_box.jpg"
    if (Test-Path $boxPath) {
        $bmp = [System.Drawing.Bitmap]::new($boxPath)
        Crop-Rect $bmp ([System.Drawing.Rectangle]::new(22, 34, 76, 88)) "$clothesDir\$($bc.Name)"
        $bmp.Dispose()
    }
}

# Shoes items crop: y ~34 to 106, x ~14 to 106 (w: 92, h: 72)
$shoesCrops = @(
    @{ Set = 1; Name = 'shoes_sneaker_white_real.jpg' },
    @{ Set = 2; Name = 'shoes_sneaker_white_grey.jpg' },
    @{ Set = 3; Name = 'shoes_sneaker_black_white.jpg' },
    @{ Set = 4; Name = 'shoes_derby_black.jpg' },
    @{ Set = 5; Name = 'shoes_sneaker_white_beige.jpg' },
    @{ Set = 6; Name = 'shoes_sneaker_grey_white.jpg' },
    @{ Set = 13; Name = 'shoes_sneaker_runner_grey.jpg' },
    @{ Set = 14; Name = 'shoes_sneaker_white_classic.jpg' },
    @{ Set = 15; Name = 'shoes_loafer_black.jpg' }
)

foreach ($sc in $shoesCrops) {
    $boxPath = "$tplDir\set_$($sc.Set)_shoes_box.jpg"
    if (Test-Path $boxPath) {
        $bmp = [System.Drawing.Bitmap]::new($boxPath)
        Crop-Rect $bmp ([System.Drawing.Rectangle]::new(14, 32, 92, 74)) "$clothesDir\$($sc.Name)"
        $bmp.Dispose()
    }
}

Write-Host "All clothes items cropped successfully!"
