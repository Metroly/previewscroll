PreviewScroll
=============

PreviewScroll adds a preview area to your lists and reports back whenever an item is placed within its bounds. Built for Webkit mobile with vanilla JavaScript.

Usage
-----

Your HTML might look like this:

```html

<ul id='demoScroll'>
  <li>Item1</li>
  <li>Item2</li>
  ...
  <li>ItemN</li>
</ul>

```

Let PreviewScroll know which list to target and add an event handler for the previewed items:

```js

var options = {
  pause_time: 300 // How long to wait before an item is considered as being previewed.
};

var demoScroll = new PreviewScroll('#demoScroll', options);

demoScroll.onPreview = function (previewedElement) {
  console.log('The previewed item is ', previewedElement);
};

```