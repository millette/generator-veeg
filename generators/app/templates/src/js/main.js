/* global vegaEmbed <%- vegaTooltip ? ', vegaTooltip' : '' %> */

'use strict'

vegaEmbed('#viz', '../data/<%- vegaLite ? 'spec-lite.json' : 'spec.json' %>', { actions: false })
  .then(function(result) {
    <% if (vegaTooltip) { %>
      <% if (vegaLite) { %>
        vegaTooltip.vegaLite(result.view, result.spec) // [, options]
      <% } else { %>
        vegaTooltip.vega(result.view) // [, options]
      <% } %>
    <% } %>
  })
  .catch(console.error)
