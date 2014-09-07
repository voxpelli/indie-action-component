(function(){  

  var indieConfig = undefined,
    indieConfigFrame = undefined,
    loadIndieConfig = function () {
      if (indieConfigFrame) {
        return;
      }

      indieConfigFrame = document.createElement('iframe');
      indieConfigFrame.src = 'web+indieconfig:load';
      document.getElementsByTagName('body')[0].appendChild(indieConfigFrame);

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
        this.innerHTML = '<a href="#">An Action!</a';
      },
      inserted: function() {},
      removed: function() {},
      attributeChanged: function() {}
    }, 
    events: { 
      'click:delegate(a)' : function (e) {
        e.preventDefault();
        var self = this;
        var doTheAction = function () {
          window.location = indieConfig.reply + '?url=' + encodeURIComponent(window.location.href);
        };
        var waitForConfig = function () {
          window.removeEventListener('IndieConfigLoaded', waitForConfig);
          doTheAction(self);
        };
        if (!indieConfig) {
          window.addEventListener('IndieConfigLoaded', waitForConfig);
          loadIndieConfig();
        } else {
          doTheAction(self);
        }
      }
    },
    accessors: {
      
    }, 
    methods: {
      
    }
  });

})();
