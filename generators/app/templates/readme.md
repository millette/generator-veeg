# Vega demo

[Vega][] is a visualization grammar, a declarative language for creating, saving, and sharing interactive visualization designs. With Vega, you can describe the visual appearance and interactive behavior of a visualization in a JSON format, and generate web-based views using Canvas or SVG.

veeg will generate this file structure:

```
src
├── css
│   ├── main.css
│   └── normalize.css
├── data
│   ├── data.json
│   ├── spec.json
│   └── spec-lite.json
├── js
│   ├── vendor
│   │   ├── jquery-3.2.1.min.js
│   │   └── modernizr-3.5.0.min.js
│   ├── main.js
│   └── plugins.js
├── favicon.ico
├── humans.txt
├── icon.png
├── index.html
├── LICENSE.txt
└── site.webmanifest
```

Based on [html5-boilerplate][]. Vega resources are found in ```data/``` and its JavaScript code in ```src/js/main.js```.

## Available scripts
Lint JavaScript code with [standardjs][]:
```
<%- cmd %> lint
```

Launch development web server with [browser-sync][]:
```
<%- cmd %> dev
```
Your site should be available at <http://localhost:3000/>.

Convert vega-lite spec to vega with [Vega-lite][]:
```
<%- cmd %> vl2vg
```

[html5-boilerplate]: <https://github.com/h5bp/html5-boilerplate>
[standardjs]: <https://standardjs.com/>
[browser-sync]: <https://browsersync.io/>
[Vega-lite]: <https://vega.github.io/vega-lite/>
[Vega]: <https://vega.github.io/vega/>
