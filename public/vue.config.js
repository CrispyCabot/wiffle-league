module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "~@/scss/_colors.scss";
          @import "~@/scss/_fonts.scss";
        `
      }
    }
  }
}