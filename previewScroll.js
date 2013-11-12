var splice = Array.prototype.splice;

var opts = {
  pause_time: 300
};

var run = function () {

  var item, ul,
    items = document.querySelectorAll('li'),
    firstItem = items[0],
    lastItem = items[items.length - 1];

  items = splice.call(items, 1, items.length - 1);
  item = items[0];
  ul = document.querySelector('ul');


  /* Position the preview area */

  var ulHeight = ul.clientHeight;
  var previewArea = document.querySelector('.preview-area');
  previewArea.style.height = item.offsetHeight + 'px';

  var previewAreaTop = (ulHeight - previewArea.clientHeight) / 2;
  var midDistance = ul.offsetTop + previewAreaTop;
  previewArea.style.top = midDistance + 'px';

  /* Ensure scroll boundaries do not exceed first and last items */

  var boundaryOffset = previewAreaTop - firstItem.offsetHeight;
  firstItem.style.marginTop =   boundaryOffset + 'px';
  lastItem.style.marginBottom = boundaryOffset + 'px';


  /* Determine which element is inside the preview area */
  var findPreviewedItem = function () {
    console.log('You stopped scrolling. Lets find the previewed item...');
  };

  /* Detect when the user pauses or stops scrolling */

  var timeoutId, prevScroll;

  ul.addEventListener('scroll', function (evt) {
    var currScroll = ul.scrollTop;

    if (!prevScroll) {
      prevScroll = currScroll;
      return;
    }

    if (prevScroll === currScroll) {
      return;
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      if (prevScroll === currScroll) {
        findPreviewedItem();
      }
    }, opts.pause_time);

    prevScroll = currScroll;
  });
};

document.addEventListener('DOMContentLoaded', run);