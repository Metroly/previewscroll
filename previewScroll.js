(function () {

var splice = Array.prototype.splice;

var opts = {
  pause_time: 300
};

var run = function () {

  var item, ul,
    allItems = document.querySelectorAll('li'),
    firstItem = allItems[0],
    lastItem = allItems[allItems.length - 1],
    allItemsLen = allItems.length,
    items = splice.call(allItems, 1, allItemsLen - 1);

  item = items[0];
  ul = document.querySelector('ul');
  
  /* Position the preview area */

  var ulHeight = ul.clientHeight;
  var previewArea = document.querySelector('.preview-area');
  previewArea.style.height = item.offsetHeight + 'px';

  var previewAreaTop = (ulHeight - previewArea.offsetHeight) / 2;
  var midDistance = ul.offsetTop + previewAreaTop;
  previewArea.style.top = midDistance + 'px';

  /* Ensure scroll boundaries do not exceed first and last items */

  var boundaryOffsetFirstItem = previewAreaTop - firstItem.offsetHeight;
  var boundaryOffsetLastItem = previewAreaTop - lastItem.offsetHeight;
  firstItem.style.marginTop =   boundaryOffsetFirstItem + 'px';
  lastItem.style.marginBottom =  boundaryOffsetLastItem + 'px';


  /* Snap to preview position when the user touches/clicks away. */

  ul.addEventListener('mouseup', function () {
    var target = findPreviewedItem();
    var targetTop = target.offsetTop - ul.scrollTop;
    var prevAreaTop = previewArea.offsetTop - ul.offsetTop;

    ul.scrollTop += (targetTop - prevAreaTop);
  });

  /*
   * @private
   * Determines which element is inside the preview area.
   * Returns {Element} the item being previewed.
   */
  var findPreviewedItem = function () {
    var i = 0, distToTarget, itemHeights = 0, targetElem, currElem, currStyle;

    distToTarget = ul.scrollTop + (ul.offsetHeight / 2);

    for (i; i < allItemsLen; i++) {
      currElem = allItems[i];
      currStyle = currElem.style;

      itemHeights += currElem.offsetHeight;
      itemHeights += currStyle.marginTop ? parseInt(currStyle.marginTop, 10) : 0;
      itemHeights += currStyle.marginBottom ? parseInt(currStyle.marginBottom, 10) : 0;

      if (distToTarget < itemHeights) {
          targetElem = currElem;
          break;
      }
    }

    return targetElem;
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

} ());