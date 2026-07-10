const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    purgecss({
      // Ahora solo buscará las clases utilizadas en index2.html
      content: ['./index2.html'],
      
      // Clases protegidas para que NUNCA se borren
      safelist: ['clase-dinamica', /^active-/]
    })
  ]
}

/*

npx postcss css/bootstrap.min.css -o css/bootstrap.min.purged.css
npx postcss css/style.min.css -o css/style.min.purged.css
npx postcss css_custom/style_custom.min.css -o css_custom/style_custom.min.purged.css
npx postcss css_custom/style_index.min.css -o css_custom/style_index.min.purged.css

    <link rel="stylesheet" href="/css/bootstrap.min.purged.css">
    <link rel="stylesheet" href="/css/style.min.purged.css">
    <link rel="stylesheet" href="/css_custom/style_custom.min.purged.css">

*/