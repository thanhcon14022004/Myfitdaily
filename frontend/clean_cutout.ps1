Add-Type -AssemblyName System.Drawing

function Clean-Cutout($inputPath, $outputPath, $darkThreshold, $softBand) {
    $src = [System.Drawing.Bitmap]::FromFile($inputPath)
    $w = $src.Width
    $h = $src.Height
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $p = $src.GetPixel($x, $y)
            $lum = 0.299 * $p.R + 0.587 * $p.G + 0.114 * $p.B
            
            if ($lum -le $darkThreshold) {
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($lum -lt ($darkThreshold + $softBand)) {
                $alpha = [int](255 * ($lum - $darkThreshold) / $softBand)
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
            } else {
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
            }
        }
    }
    
    $dest.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $src.Dispose()
    $dest.Dispose()
    Write-Output "Cleaned: $outputPath"
}

# In male image, background is dark (0 to 60)
Clean-Cutout "d:\Ki8\PRN232\MYFITDAILY\MYFITDAILY_EXE201_Group6\frontend\public\assets\mannequin_male.jpg" "d:\Ki8\PRN232\MYFITDAILY\MYFITDAILY_EXE201_Group6\frontend\public\assets\mannequin_male.png" 62 25

# In female image, background reaches up to approx 75-80
Clean-Cutout "d:\Ki8\PRN232\MYFITDAILY\MYFITDAILY_EXE201_Group6\frontend\public\assets\mannequin_female.jpg" "d:\Ki8\PRN232\MYFITDAILY\MYFITDAILY_EXE201_Group6\frontend\public\assets\mannequin_female.png" 82 25
