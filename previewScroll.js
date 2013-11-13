var splice = Array.prototype.splice;

var opts = {
  pause_time: 200
};

var run = function () {

  var item, ul,
    allItems = document.querySelectorAll('li'),
    firstItem = allItems[0],
    lastItem = allItems[allItems.length - 1],
    items = splice.call(allItems, 1, allItems.length - 1);

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


  /* Determine which element is inside the preview area */
  
  var findPreviewedItem = function () {
    console.log('You stopped scrolling. Lets find the previewed item...');

    var i = 0, allItemsLen = allItems.length , distScrolledToTarget, itemHeights = 0, targetElem;
    
    distScrolledToTarget = ul.scrollTop + previewAreaTop - (previewArea.offsetHeight / 2);
    
    for (i; i < allItemsLen; i++) {
        itemHeights += allItems[i].offsetHeight;
        if (distScrolledToTarget < itemHeights) {
            targetElem = allItems[i];
            break;
        }
    }

    console.log('Distance from top ', itemHeights, targetElem, "amount scrolled: ", distScrolledToTarget);
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

    // clearTimeout(timeoutId);
    // timeoutId = setTimeout(function () {
    //   if (prevScroll === currScroll) {
    //     findPreviewedItem();
    //   }
    // }, opts.pause_time);

    prevScroll = currScroll;
  });
};

document.addEventListener('DOMContentLoaded', run);