;(function (NS,$,_) {

  NS.Zoetrope = function(selector, opts) {
    var self = this;
    this.opts = $.extend({}, this.default_opts, opts);
    if (this.opts.frame_position) this._getFramePosition = _.bind(this.opts.frame_position, this);
    this.current_frame = this.opts.current_frame || 0;

    if (this.opts.force_size) {
      this.$el = $(selector).css({
        height: this.opts.frame_height,
        width: this.opts.frame_width,
        overflow: "hidden",
        position: "relative"
      });
    } else {
      this.$el = $(selector);
    }

    // pid for tracking setTimeout's
    this.tid = null;

    this.loaded = this._loadImage(this.opts).done(function($img) {

      if (!self.opts.force_size) {
        self.setBackgroundSize();
        $(window).on("resize", function() {
          // console.log("resize");
          self.setBackgroundSize();
        });
      }

      self.$el.css({
        "background-image": "url("+$img.attr("src")+")",
        "background-repeat": "no-repeat"
      });
      self._gotoFrame(self.current_frame);
    });
  };
  NS.Zoetrope.prototype = {
    default_opts: {
      frame_height: 100,
      frame_width: 100,
      frame_count: 1,
      loop: true,
      force_size: true
    },
    setBackgroundSize: function() {
      var self = this;
      // console.log("set bg size");
      /* derive sizes from wrapper width */
      var bgsize = self._getBackgroundSize();
      var fp = self.getFramePosition(this.current_frame);
      self.$el.css({
        "background-position": "-"+fp[0]+"px -"+fp[1]+"px",
        "background-size": bgsize
      });
    },
    _getBackgroundSize: function() {
      this.scale = this.$el.width()/this.opts.frame_width;
      var window_height = $(window).height();
      // console.log("scale width", this.scale);
      if ((this.scale*this.opts.frame_height) < window_height) {
        // console.log("scale height", this.scale);
        this.scale = window_height/this.opts.frame_height;
      }
      return this.opts.image_width*this.scale+"px "+this.opts.image_height*this.scale+"px";    
    },
    _loadImage: function(opts) {
      var self = this,
        dfd = $.Deferred(),
        img = new Image();
      
      this.$img = $(img).attr("src", opts.path)
            .load(function() {
              self.opts.image_height = img.height;
              self.opts.image_width = img.width;
              dfd.resolve($(img));
            });
      
      return dfd.promise();
    },
    getFramePosition: function(num) {
      var pos = this._getFramePosition(num);
      if (this.opts.force_size === false) {
        pos[0] = pos[0]*this.scale;
        pos[1] = pos[1]*this.scale;
      }
      return pos;
    },
    /* is overriden by opts.frame_position if passed as an option */
    _getFramePosition: function(num) {
      return [0,num*this.opts.frame_height];
    },
    _gotoFrame: function(num) {
      num = ~~num;
      if (this.opts.loop) {
        if (num < 0) num = this.opts.frame_count + num;
        num = num % this.opts.frame_count;
      } else {
        if (num < 0) num = 0;
        else if (num >= this.opts.frame_count) num = this.opts.frame_count-1;
      }

      var fp = this.getFramePosition(num);
      this.$el.css({
        "background-position": "-"+fp[0]+"px -"+fp[1]+"px"
      });
      this.current_frame = num;
      return this.current_frame;
    },
    gotoFrame: function(num, speed) {
      var self = this;
      if (!speed) speed = 0;
      if (speed === 0) {
        return this._gotoFrame(num);
      } else {
        // animate through from this.current_frame to frame num at speed
        if (self.tid) window.clearTimeout(self.tid);
        var dfd = $.Deferred();
        var ms = 1000/speed;
        var steps;
        if (self.current_frame > num) {
          steps = _.range(num, self.current_frame).reverse();
        } else {
          steps = _.range(self.current_frame, num).slice(1);
        }
        var step = function() {
          self._gotoFrame(steps.shift());
          if (steps.length > 0) {
            self.tid = setTimeout(step, ms);
          } else {
            dfd.resolve(self.current_frame);
          }
        };
        step();

        return dfd;
      }
    },
    gotoNextFrame: function() {
      return this._gotoFrame(this.current_frame+1);
    },
    gotoPrevFrame: function() {
      return this._gotoFrame(this.current_frame-1);
    }
  };
})(window, window.jQuery, window._);
