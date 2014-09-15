This is a proof of concept of a Web Component for the IndieWeb [WebActions](http://indiewebcamp.com/webactions) tag: `<indie-action>`

This is built using Mozilla's [X-Tags](http://x-tags.org/) library

The component can be found in `src/main.js`

A copy of X-Tags itself can be found in `demo/x-tag-components.js`, but should preferably be downloaded from X-Tags instead.

### To configure your reply endpoint for use with this

First do `navigator.registerProtocolHandler('web+action', '/?url=%s', 'IndieWeb')` somewhere to register your site.

Then on the site registered as '/?url=%s' add your configuration like:

    if (window.parent !== window) {
      window.parent.postMessage(JSON.stringify({
        // The config of your reply endpoint
        reply: 'https://example.com/reply?u={url}'
      }), '*');
    }

That code will send the configuration to the parent window when its loaded using an iframe. The iframe will point to `web+action:load` which will auto-resolve to your site when loaded.

### Live on

* [VoxPelli.com](http://voxpelli.com/2013/12/webmentions-for-static-pages/) – for replying to blog posts
