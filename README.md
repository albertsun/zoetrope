# Zoetrope.js

Zoetrope.js is a javascript library for creating an animated gif like effect from a sequence of still images. Why would you want to do that? That way you can get detailed control over specific frames and the rate at which they play. The filesize might also be smaller and can be in any image format your browser supports.

Depends on jQuery and Underscore (kinda trivially though if I get around to it but most pages I work on have them there already so ¯\\\_(ツ)_/¯). 

This will render a 300x225 non-looping zoetrope with 114 frames into the element found with the `#container` selector.

```
var z = new Zoetrope("#container", {
  path: "reel.png",
  frame_width: 300,
  frame_height: 225,
  frame_count: 114,
  loop: false
});
```

Example: http://albertsun.github.io/zoetrope/example.html

Once you've created one, there are a few methods and properties you can access.

```
z.current_frame;

z.gotoFrame(50); // immediately jump to a frame

z.gotoFrame(z.opts.frame_count-1, 30) // animate through to the last frame at 30fps

z.gotoNextFrame();
z.gotoPrevFrame();

```

### Other Options

* `force_size`
    `false` by default.

    `true` to force the container element to the size of the frame.

* `current_frame`
    The frame number to start on by default, if not the first.

* `loop`
    `true` by default. When the last frame is reached the first frame will be next. Otherwise stop.

* `frame_position`
    If the filmstrip is not a single vertical image, how to find the top left corner of a frame from the frame number. For example if you've got 74 frames arranged 37 high and 2 wide.

```
    frame_position: function(i) {
      if (i<37) return [0, i*600];
      return [900,(i-37)*600];
    }
```

### Creating image reels

Imagemagick's convert utility works well. To convert a folder of images named `image1.png` `image2.png` etc to one long vertical filmstrip for Zoetrope.js run

```
convert image*.png -append reel.png
```

If you're starting with a gif, you can convert that to individual frames like so before the previous step.

```
convert -coalesce AlertSpicyBlueandgoldmackaw.gif image%05d.png
```

### Miscellany

This was originally created to power http://bklynr.com/one-block-in-crown-heights/

There's lots it doesn't do, but it should be fairly straightforward to extend. Mostly just publishing this to get it off my computer so I don't lose it and find myself re-writing this again.

The example gif is from https://gfycat.com/about and http://gfycat.com/AlertSpicyBlueandgoldmackaw which has much smaller filesize, but it's not controllable via javascript.

