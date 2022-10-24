const { join } = require('path')

const deployDir = join(__dirname, 'public')

async function compress() {
  const imagemin = await import('imagemin')
  const imageminJpegtran = await import('imagemin-jpegtran')
  const imageminPngquant = await import('imagemin-pngquant')
  const files = await imagemin([deployDir + '/**/*.{jpg,png}'], {
    destination: 'tmp/images',
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8]
      })
    ]
  })
  console.log(files)
}

compress()
