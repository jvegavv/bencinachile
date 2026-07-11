const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    purgecss({
      content: ['./index2.html', './*.html'],
      safelist: ['clase-dinamica', /^active-/],
      // 1. Activa el rastreo de clases eliminadas
      rejected: true, 
      // 2. Esta función recibe una lista de las clases que se van a borrar
      rejectedCss: (rejectedCss) => {
        console.log('=== [PurgeCSS Log] ===');
        if (rejectedCss.length === 0) {
          console.warn('⚠️ No se eliminó ninguna clase. ¡Revisa si la ruta de "content" es correcta!');
        } else {
          console.log(`✅ ¡Éxito! Se eliminaron ${rejectedCss.length} clases no utilizadas.`);
          // Opcional: Descomenta la línea de abajo si quieres ver la lista exacta de clases borradas
          // console.log('Clases eliminadas:', rejectedCss);
        }
        console.log('=======================\n');
      }
    }),
    cssnano({
      preset: 'default',
    }),
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