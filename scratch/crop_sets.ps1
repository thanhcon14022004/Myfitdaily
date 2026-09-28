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

$outDir = 'D:\EXE-Myfitdaily\Web\frontend\public\assets\templates'

$jobs = @(
    @{ Path = 'C:\Users\Admin\.gemini\antigravity\brain\e529032b-ab65-49ed-8e98-f37de33792ab\.user_uploaded\media_1790610862966.jpg'; Sets = @(1, 2, 3) },
    @{ Path = 'C:\Users\Admin\.gemini\antigravity\brain\e529032b-ab65-49ed-8e98-f37de33792ab\.user_uploaded\media_1790610932131.jpg'; Sets = @(4, 5, 6) },
    @{ Path = 'C:\Users\Admin\.gemini\antigravity\brain\e529032b-ab65-49ed-8e98-f37de33792ab\.user_uploaded\media_1790610840946.jpg'; Sets = @(13, 14, 15) }
)

$cardXs = @(2, 343, 684)

foreach ($job in $jobs) {
    $srcImg = [System.Drawing.Bitmap]::new($job.Path)
    for ($i = 0; $i -lt 3; $i++) {
        $setNum = $job.Sets[$i]
        $baseX = $cardXs[$i]

        # 1. Card (whole card panel)
        $cardRect = [System.Drawing.Rectangle]::new($baseX, 12, 337, 658)
        Crop-Rect $srcImg $cardRect "$outDir\set_${setNum}_card.jpg"

        # 2. Model (full body model on left)
        $modelX = $baseX + 4
        $modelRect = [System.Drawing.Rectangle]::new($modelX, 40, 208, 620)
        Crop-Rect $srcImg $modelRect "$outDir\set_${setNum}_model.jpg"

        # 3. Top box
        $topRect = [System.Drawing.Rectangle]::new($baseX + 212, 92, 120, 154)
        Crop-Rect $srcImg $topRect "$outDir\set_${setNum}_top_box.jpg"

        # 4. Bot box
        $botRect = [System.Drawing.Rectangle]::new($baseX + 212, 254, 120, 160)
        Crop-Rect $srcImg $botRect "$outDir\set_${setNum}_bot_box.jpg"

        # 5. Shoes box
        $shoesRect = [System.Drawing.Rectangle]::new($baseX + 212, 428, 120, 148)
        Crop-Rect $srcImg $shoesRect "$outDir\set_${setNum}_shoes_box.jpg"

        Write-Host "Set $setNum cropped successfully to set_${setNum}_*.jpg"
    }
    $srcImg.Dispose()
}

# Clean up accidental set__*.jpg files
Remove-Item "$outDir\set__*.jpg" -ErrorAction SilentlyContinue

Write-Host "All 9 sets cropped and saved cleanly!"
