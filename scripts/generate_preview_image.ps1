Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$outputPath = (Resolve-Path "preview.png").Path

$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

try {
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $navColor = [System.Drawing.Color]::FromArgb(13, 107, 87)
  $presentColor = [System.Drawing.Color]::FromArgb(90, 156, 181)
  $accentColor = [System.Drawing.Color]::FromArgb(250, 206, 104)
  $missColor = [System.Drawing.Color]::FromArgb(231, 111, 81)
  $pageBg = [System.Drawing.Color]::FromArgb(255, 248, 239)
  $textColor = [System.Drawing.Color]::FromArgb(31, 36, 48)
  $white = [System.Drawing.Color]::White

  $graphics.Clear($pageBg)

  $headerBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    ([System.Drawing.Rectangle]::new(0, 0, $width, 210)),
    $navColor,
    $presentColor,
    0
  )
  $graphics.FillRectangle($headerBrush, 0, 0, $width, 210)
  $headerBrush.Dispose()

  $titleFont = New-Object System.Drawing.Font("Arial", 42, [System.Drawing.FontStyle]::Bold)
  $subtitleFont = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Regular)
  $pillFont = New-Object System.Drawing.Font("Arial", 18, [System.Drawing.FontStyle]::Bold)
  $tileFont = New-Object System.Drawing.Font("Arial", 34, [System.Drawing.FontStyle]::Bold)

  $graphics.DrawString("Speller", $titleFont, ([System.Drawing.SolidBrush]::new($white)), 70, 56)
  $graphics.DrawString(
    "A South African daily word game in English and Afrikaans",
    $subtitleFont,
    ([System.Drawing.SolidBrush]::new($white)),
    72,
    122
  )

  $pillBrush = [System.Drawing.SolidBrush]::new($accentColor)
  $pillTextBrush = [System.Drawing.SolidBrush]::new($textColor)
  $pillRects = @(
    [System.Drawing.RectangleF]::new(70, 255, 130, 42),
    [System.Drawing.RectangleF]::new(215, 255, 130, 42),
    [System.Drawing.RectangleF]::new(360, 255, 130, 42),
    [System.Drawing.RectangleF]::new(505, 255, 160, 42),
    [System.Drawing.RectangleF]::new(680, 255, 165, 42)
  )
  $pillTexts = @("Grade 2", "Grade 3", "Grade 4", "English", "Afrikaans")
  foreach ($i in 0..($pillRects.Length - 1)) {
    $rect = $pillRects[$i]
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $radius = 18
    $diameter = $radius * 2
    $path.AddArc($rect.X, $rect.Y, $diameter, $diameter, 180, 90)
    $path.AddArc($rect.Right - $diameter, $rect.Y, $diameter, $diameter, 270, 90)
    $path.AddArc($rect.Right - $diameter, $rect.Bottom - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($rect.X, $rect.Bottom - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    $graphics.FillPath($pillBrush, $path)
    $graphics.DrawString($pillTexts[$i], $pillFont, $pillTextBrush, $rect.X + 18, $rect.Y + 8)
    $path.Dispose()
  }
  $pillBrush.Dispose()
  $pillTextBrush.Dispose()

  $tileSize = 110
  $tileGap = 18
  $startX = 72
  $startY = 345
  $letters = @("S", "P", "E", "L", "L", "E", "R")
  $colors = @($navColor, $presentColor, $accentColor, $missColor, $navColor, $presentColor, $accentColor)

  for ($i = 0; $i -lt $letters.Length; $i++) {
    $x = $startX + ($i * ($tileSize + $tileGap))
    $rect = [System.Drawing.Rectangle]::new($x, $startY, $tileSize, $tileSize)
    $tileBrush = [System.Drawing.SolidBrush]::new($colors[$i])
    $graphics.FillEllipse($tileBrush, $rect)
    $graphics.DrawEllipse(([System.Drawing.Pen]::new($textColor, 4)), $rect)
    $tileBrush.Dispose()

    $stringSize = $graphics.MeasureString($letters[$i], $tileFont)
    $textX = $x + (($tileSize - $stringSize.Width) / 2)
    $textY = $startY + (($tileSize - $stringSize.Height) / 2) - 4
    $graphics.DrawString($letters[$i], $tileFont, ([System.Drawing.SolidBrush]::new($white)), $textX, $textY)
  }

  $footerFont = New-Object System.Drawing.Font("Arial", 18, [System.Drawing.FontStyle]::Regular)
  $graphics.DrawString("Play, spell, and collect emoji rewards", $footerFont, ([System.Drawing.SolidBrush]::new($textColor)), 72, 505)

  $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
}
finally {
  $graphics.Dispose()
  $bitmap.Dispose()
}
