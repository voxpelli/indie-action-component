(function(){  

  // return;

  var indieConfig,
    indieConfigFrame,
    loadIndieConfig = function () {
      if (indieConfigFrame) {
        return;
      }

      indieConfigFrame = document.createElement('iframe');
      indieConfigFrame.src = 'web+indie:load';
      document.getElementsByTagName('body')[0].appendChild(indieConfigFrame);
      indieConfigFrame.style.display = 'none';

      window.addEventListener('message', parseIndieConfig);
    },
    parseIndieConfig = function (message) {
      var correctSource = (indieConfigFrame && message.source === indieConfigFrame.contentWindow);

      if (!correctSource) {
        return;
      }

      try {
        indieConfig = JSON.parse(message.data);
      } catch (e) {}

      if (indieConfig) {
        indieConfigFrame.parentNode.removeChild(indieConfigFrame);
        indieConfigFrame = undefined;
        xtag.fireEvent(window, 'IndieConfigLoaded');
        window.removeEventListener('message', parseIndieConfig)
      }
    };

  xtag.register('indie-action', {
    extends: 'a',
    lifecycle: {
      created: function() {
        this.innerHTML = '<a href="#"></a>';
        this.childNodes[0].textContent = this.title || (this.do === 'reply' ? 'Reply' : 'Unknown');
      },
      inserted: function() {},
      removed: function() {},
      attributeChanged: function() {}
    }, 
    events: { 
      'click:delegate(a)' : function (e) {
        e.preventDefault();
        var elem = this.parentNode;
        var doTheAction = function () {
          var href;

          if (this.do === 'reply' && indieConfig.reply) {
            href = indieConfig.reply;
          }

          if (!href && this.href) {
            href = this.href;
          }

          if (href) {
            href += href.indexOf('?') === -1 ? '?' : '&';
            href += 'url=' + encodeURIComponent(window.location.href);
            window.location = href;
          }
        };
        var waitForConfig = function () {
          window.removeEventListener('IndieConfigLoaded', waitForConfig);
          doTheAction.call(elem);
        };
        if (!indieConfig) {
          window.addEventListener('IndieConfigLoaded', waitForConfig);
          loadIndieConfig();
        } else {
          doTheAction.call(elem);
        }
      }
    },
    accessors: {
      do: {
        attribute: { name:'do' } // use a different attribute name
      }
    }, 
    methods: {
      
    }
  });

})();
