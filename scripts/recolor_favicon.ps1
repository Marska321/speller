Add-Type -AssemblyName System.Drawing

$targetColor = [System.Drawing.Color]::FromArgb(255, 13, 107, 87)
$files = @(
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png"
)

function Recolor-Icon($path) {
  $resolvedPath = (Resolve-Path $path).Path
  $bitmap = [System.Drawing.Bitmap]::new($resolvedPath)
  try {
    for ($x = 0; $x -lt $bitmap.Width; $x++) {
      for ($y = 0; $y -lt $bitmap.Height; $y++) {
        $pixel = $bitmap.GetPixel($x, $y)
        if ($pixel.A -eq 0) {
          continue
        }

        $isWhite = $pixel.R -ge 220 -and $pixel.G -ge 220 -and $pixel.B -ge 220
        $isDark = $pixel.R -le 70 -and $pixel.G -le 70 -and $pixel.B -le 70
        $isBlueish = $pixel.B -gt $pixel.R -and $pixel.B -gt $pixel.G

        if (-not $isWhite -and -not $isDark -and $isBlueish) {
          $brightness = ($pixel.R + $pixel.G + $pixel.B) / (255 * 3)
          $factor = [Math]::Min([Math]::Max($brightness * 1.15, 0.8), 1.15)
          $newR = [Math]::Min([Math]::Round($targetColor.R * $factor), 255)
          $newG = [Math]::Min([Math]::Round($targetColor.G * $factor), 255)
          $newB = [Math]::Min([Math]::Round($targetColor.B * $factor), 255)
          $bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($pixel.A, $newR, $newG, $newB))
        }
      }
    }

    $tmpPath = "$resolvedPath.tmp.png"
    $bitmap.Save($tmpPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $bitmap.Dispose()
  }

  Move-Item -Force $tmpPath $resolvedPath
}

foreach ($file in $files) {
  Recolor-Icon $file
}

$pngBytes = [System.IO.File]::ReadAllBytes((Resolve-Path "favicon-32x32.png").Path)
$fs = [System.IO.File]::Create((Resolve-Path "favicon.ico").Path)
$bw = [System.IO.BinaryWriter]::new($fs)

try {
  $bw.Write([UInt16]0)
  $bw.Write([UInt16]1)
  $bw.Write([UInt16]1)
  $bw.Write([Byte]32)
  $bw.Write([Byte]32)
  $bw.Write([Byte]0)
  $bw.Write([Byte]0)
  $bw.Write([UInt16]1)
  $bw.Write([UInt16]32)
  $bw.Write([UInt32]$pngBytes.Length)
  $bw.Write([UInt32]22)
  $bw.Write($pngBytes)
}
finally {
  $bw.Dispose()
  $fs.Dispose()
}
