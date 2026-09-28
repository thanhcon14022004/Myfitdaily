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

$tplDir = 'D:\EXE-Myfitdaily\Web\frontend\public\assets\templates'
$clothesDir = 'D:\EXE-Myfitdaily\Web\frontend\public\assets\clothes'

# Set 7
$b1 = [System.Drawing.Bitmap]::new("$tplDir\set_7_top_box.jpg")
Crop-Rect $b1 ([System.Drawing.Rectangle]::new(14, 34, 92, 74)) "$clothesDir\tshirt_oversize_graphic.jpg"
$b1.Dispose()

$b2 = [System.Drawing.Bitmap]::new("$tplDir\set_7_bot_box.jpg")
Crop-Rect $b2 ([System.Drawing.Rectangle]::new(22, 34, 76, 88)) "$clothesDir\jeans_wide_light_blue.jpg"
$b2.Dispose()

# Set 8
$b3 = [System.Drawing.Bitmap]::new("$tplDir\set_8_top_box.jpg")
Crop-Rect $b3 ([System.Drawing.Rectangle]::new(14, 34, 92, 74)) "$clothesDir\hoodie_black.jpg"
$b3.Dispose()

$b4 = [System.Drawing.Bitmap]::new("$tplDir\set_8_bot_box.jpg")
Crop-Rect $b4 ([System.Drawing.Rectangle]::new(22, 34, 76, 88)) "$clothesDir\pants_jogger_charcoal.jpg"
$b4.Dispose()

# Set 9
$b5 = [System.Drawing.Bitmap]::new("$tplDir\set_9_top_box.jpg")
Crop-Rect $b5 ([System.Drawing.Rectangle]::new(14, 34, 92, 74)) "$clothesDir\jacket_windbreaker_cream.jpg"
$b5.Dispose()

$b6 = [System.Drawing.Bitmap]::new("$tplDir\set_9_bot_box.jpg")
Crop-Rect $b6 ([System.Drawing.Rectangle]::new(22, 34, 76, 88)) "$clothesDir\pants_cargo_green.jpg"
$b6.Dispose()

Write-Host "Set 7, 8, 9 clothes cropped successfully!"
