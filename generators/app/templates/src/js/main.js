/* global vegaEmbed <%- vegaTooltip ? ', vegaTooltip' : '' %>*/

'use strict'

vegaEmbed('#viz', '../data/spec.json', { actions: false })
  .then(function(result) {
    // result: { view, spec }
    <% if (vegaTooltip) { %>
      <% if (vegaLite) { %>
        vegaTooltip.vegaLite(view, spec[, options])
      <% } else { %>
        vegaTooltip.vega(view[, options])
      <% } %>
    <% } %>
  })
  .catch(console.error)
