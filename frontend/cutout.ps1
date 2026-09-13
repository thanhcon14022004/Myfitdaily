Add-Type -AssemblyName System.Drawing

function Remove-DarkBackground($inputPath, $outputPath) {
    $src = [System.Drawing.Bitmap]::FromFile($inputPath)
    $w = $src.Width
    $h = $src.Height
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    # Process pixels
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $p = $src.GetPixel($x, $y)
            $lum = 0.299 * $p.R + 0.587 * $p.G + 0.114 * $p.B
            
            # Background is dark gray/black (lum approx 10 to 60)
            # Mannequin is bright white/light gray (lum > 95)
            if ($lum -lt 48) {
                # Completely transparent background
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($lum -lt 85) {
                # Smooth edge feathering
                $alpha = [int](255 * ($lum - 48) / (85 - 48))
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
            } else {
                # Fully opaque mannequin body
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
            }
        }
    }
    
    $dest.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $src.Dispose()
    $dest.Dispose()
    Write-Output "Saved: $outputPath"
}

Remove-DarkBackground "d:\Ki8\PRN232\MYFITDAILY\MYFITDAILY_EXE201_Group6\frontend\public\assets\mannequin_male.jpg" "d:\Ki8\PRN232\MYFITDAILY\MYFITDAILY_EXE201_Group6\frontend\public\assets\mannequin_male.png"
Remove-DarkBackground "d:\Ki8\PRN232\MYFITDAILY\MYFITDAILY_EXE201_Group6\frontend\public\assets\mannequin_female.jpg" "d:\Ki8\PRN232\MYFITDAILY\MYFITDAILY_EXE201_Group6\frontend\public\assets\mannequin_female.png"
