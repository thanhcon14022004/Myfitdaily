using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

namespace TextureBuilder
{
    public class Program
    {
        public static void Main()
        {
            string outDir = @"D:\EXE-Myfitdaily\Mobile\assets\models\textures";
            Directory.CreateDirectory(outDir);

            BuildSweaterTexture(Path.Combine(outDir, "texture_sweater_navy.jpg"));
            Console.WriteLine("Sweater texture rebuilt cleanly!");
        }

        public static void BuildSweaterTexture(string path)
        {
            using (var bmp = new Bitmap(1024, 1024))
            using (var g = Graphics.FromImage(bmp))
            {
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;

                // Authentic Deep Navy Blue (#162238 - #1E2D48) matching Frozen.HN sample
                Color navyBase = Color.FromArgb(22, 34, 56);
                Color navyLight = Color.FromArgb(28, 42, 70);
                Color navyShadow = Color.FromArgb(16, 25, 42);
                Color navyRib = Color.FromArgb(18, 28, 48);

                using (var brush = new LinearGradientBrush(new Rectangle(0, 0, 1024, 1024), navyLight, navyShadow, 45f))
                {
                    g.FillRectangle(brush, 0, 0, 1024, 1024);
                }

                // French Terry fleece / knit texture across the entire fabric
                using (var penWeave = new Pen(Color.FromArgb(10, 255, 255, 255), 1f))
                {
                    for (int y = 0; y < 1024; y += 3)
                    {
                        g.DrawLine(penWeave, 0, y, 1024, y);
                    }
                }
                using (var penVert = new Pen(Color.FromArgb(8, 0, 0, 0), 1f))
                {
                    for (int x = 0; x < 1024; x += 3)
                    {
                        g.DrawLine(penVert, x, 0, x, 1024);
                    }
                }

                // Ribbed Crewneck Collar (Round neck)
                using (var collarBrush = new SolidBrush(navyRib))
                using (var ribPen = new Pen(Color.FromArgb(38, 56, 92), 2f))
                {
                    g.FillEllipse(collarBrush, 360, 150, 304, 120);
                    using (var innerBrush = new SolidBrush(navyShadow))
                    {
                        g.FillEllipse(innerBrush, 400, 170, 224, 80);
                    }
                    for (int rx = 370; rx <= 650; rx += 4)
                    {
                        g.DrawLine(ribPen, rx, 160, rx, 250);
                    }
                }

                // Ribbed Bottom Hem (Y: 820..990)
                using (var hemBrush = new SolidBrush(navyRib))
                using (var ribPen = new Pen(Color.FromArgb(32, 48, 80), 2f))
                {
                    g.FillRectangle(hemBrush, 60, 820, 904, 180);
                    for (int hx = 60; hx <= 964; hx += 4)
                    {
                        g.DrawLine(ribPen, hx, 820, hx, 1000);
                    }
                    using (var seamPen = new Pen(navyShadow, 3f))
                    {
                        g.DrawLine(seamPen, 60, 820, 964, 820);
                    }
                }

                // Ribbed Cuffs on Sleeves
                using (var cuffBrush = new SolidBrush(navyRib))
                using (var ribPen = new Pen(Color.FromArgb(32, 48, 80), 2f))
                {
                    g.FillRectangle(cuffBrush, 400, 15, 170, 75);
                    for (int cx = 400; cx <= 570; cx += 4) g.DrawLine(ribPen, cx, 15, cx, 90);

                    g.FillRectangle(cuffBrush, 700, 15, 170, 75);
                    for (int cx = 700; cx <= 870; cx += 4) g.DrawLine(ribPen, cx, 15, cx, 90);
                }

                // Drop-shoulder seams (Left & Right)
                using (var seamPen = new Pen(Color.FromArgb(40, 10, 16, 28), 2.5f))
                {
                    g.DrawLine(seamPen, 180, 260, 420, 310);
                    g.DrawLine(seamPen, 840, 260, 600, 310);
                }

                // Save JPEG 95% quality
                var encoder = GetEncoder(ImageFormat.Jpeg);
                var ep = new EncoderParameters(1);
                ep.Param[0] = new EncoderParameter(Encoder.Quality, 95L);
                bmp.Save(path, encoder, ep);
            }
        }

        private static ImageCodecInfo GetEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == format.Guid) return codec;
            }
            return null;
        }
    }
}
