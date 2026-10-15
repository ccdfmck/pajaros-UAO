const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/Img1.json'),
      require('../image-targets/Img2.json'),
      require('../image-targets/Img3.json'),
      require('../image-targets/Img4.json'),
      require('../image-targets/Img5.json'),
    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)