/* global requestAnimationFrame*/
/* global cancelAnimationFrame*/

(function () {

  var splice = Array.prototype.splice;

  var defaultOpts = {
    pause_time: 300
  };

  var bind = function (fn, ctx) {
      return function () {
        fn.apply(ctx, arguments);
      };
  };

  /**
   * @constructor
   * Creates an instance of {PreviewScroll}
   */
  var PreviewScroll = function (containerId, opts) {
    this.ul = document.querySelector(containerId);

    var k;
    for (k in opts) {
      if (opts.hasOwnProperty(k)) {
        defaultOpts[k] = opts[k];
      }
    }

    this.createPreviewArea();
    this.run();
  };

  /**
   * @public
   * Registers an event handler that is called when an item is previewed.
   */
  PreviewScroll.prototype.onPreview = function () { };

  /**
   * @private
   * Creates the preview area in the DOM.
   */
  PreviewScroll.prototype.createPreviewArea = function () {
    var wrapDiv = document.createElement('div'),
      previewAreaDiv = document.createElement('div'),
      clonedNode = this.ul.cloneNode(true);

      previewAreaDiv.classList.add('preview-area');

      wrapDiv.appendChild(previewAreaDiv);
      wrapDiv.appendChild(clonedNode);

      var parentNode = this.ul.parentNode;
      parentNode.replaceChild(wrapDiv, this.ul);
  };

  /**
   * @private
   * TODO Break up this run method.
   */
  PreviewScroll.prototype.run = function () {
    var item, self = this, ul = this.ul,
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

    var snapToPreviewPosition = function () {

      console.log('Snap to preview psoition');

      var animationId,
        target = findPreviewedItem(),
        targetTop = target.offsetTop - ul.scrollTop,
        prevAreaTop = previewArea.offsetTop - ul.offsetTop,
        compensate = targetTop - prevAreaTop,
        cycleCount = 0;

      var scrollAnimation = function () {
        if (cycleCount >= Math.abs(compensate)) {
          cancelAnimationFrame(animationId);
          return;
        }
        ul.scrollTop += (compensate < 0) ? -1 : 1;
        cycleCount += 1;
        animationId = requestAnimationFrame(scrollAnimation);
      };

      animationId = requestAnimationFrame(scrollAnimation);
    };

    /*
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
          self.onPreview(findPreviewedItem());
          snapToPreviewPosition();
        }
      }, defaultOpts.pause_time);

      prevScroll = currScroll;
    });
  };

  PreviewScroll.prototype.updateLayout = function () {
    this.run();
  };

  this.PreviewScroll = PreviewScroll;

} ());