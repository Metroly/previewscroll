/*
 * PreviewScroll
 * http://github.com/metroly/previewscroll
 * @license MIT
 */

(function (root) {
  "use strict";

  var noop, splice, query, queryAll, extend, defaultOpts, PreviewScroll;

  /* Some helpers */

  noop = function () {};

  splice = Array.prototype.splice;

  query = function (q) {
    return document.querySelector.call(document, q);
  };

  queryAll = function (q) {
    return document.querySelectorAll.call(document, q);
  };

  extend = function (baseObj, childObj) {
    var k;
    for (k in childObj) {
      if (childObj.hasOwnProperty(k)) {
        baseObj[k] = childObj[k];
      }
    }
  };

  /* Overrideable defaults */

  defaultOpts = {
    pause_time: 300
  };

  /**
   * @constructor
   * Creates an instance of {PreviewScroll}
   */
  PreviewScroll = function (listId, opts) {
    this.el = listId;

    if (opts) {
      extend(defaultOpts, opts);
    }

    this.createPreviewArea();
    this.setDomReferences();
    this.positionPreviewArea();
    this.ensureScrollBoundaries();
    this.listenToScrollPauses();
  };

  PreviewScroll.prototype.onPreview = noop;

  /**
   * @private
   * Sets references to the DOM as instance properties.
   */
  PreviewScroll.prototype.setDomReferences = function () {
    this.ul = query(this.el);
    this.allItems = queryAll('li');
    this.allItemsLen = this.allItems.length;
    this.firstItem = this.allItems[0];
    this.lastItem = this.allItems[this.allItemsLen - 1];
    this.items = splice.call(this.allItems, 1, this.allItemsLen - 1);
    this.item = this.items[0];
    this.previewArea = query('.preview-area');
  };

  /**
   * @private
   * Creates the preview area and inserts it into the DOM.
   */
  PreviewScroll.prototype.createPreviewArea = function () {
    var parentToUl,
      wrappingDiv = document.createElement('div'),
      previewAreaDiv = document.createElement('div'),
      tempUl = query(this.el),
      clonedUlNode = tempUl.cloneNode(true);

    clonedUlNode.classList.add('preview-scroll');
    previewAreaDiv.classList.add('preview-area');

    wrappingDiv.appendChild(previewAreaDiv);
    wrappingDiv.appendChild(clonedUlNode);

    parentToUl = tempUl.parentNode;
    parentToUl.replaceChild(wrappingDiv, tempUl);

    this.ul = tempUl;
  };

  /**
   * @private
   * Positions the preview area to the vertical center of the ul.
   */

  PreviewScroll.prototype.positionPreviewArea = function () {
    var ul = this.ul,
      item = this.item,
      ulHeight = ul.clientHeight,
      previewArea = document.querySelector('.preview-area'),
      midDistance;

    previewArea.style.height = item.offsetHeight + 'px';
    previewArea.style.width = item.offsetWidth + 'px';
    previewArea.style.position = 'absolute';

    this.previewAreaTop = (ulHeight - previewArea.offsetHeight) / 2;

    midDistance = ul.offsetTop + this.previewAreaTop;
    previewArea.style.top = midDistance + 'px';
  };

  /**
   * @private
   * Ensure scroll boundaries do not exceed first and last items.
   */
  PreviewScroll.prototype.ensureScrollBoundaries = function () {
    var previewAreaTop = this.previewAreaTop,
      firstItem = this.firstItem,
      lastItem = this.lastItem,
      boundaryOffsetFirstItem = previewAreaTop - firstItem.offsetHeight,
      boundaryOffsetLastItem = previewAreaTop - lastItem.offsetHeight;

    firstItem.style.marginTop =   boundaryOffsetFirstItem + 'px';
    lastItem.style.marginBottom =  boundaryOffsetLastItem + 'px';
  };

  /**
   * @private
   * Determines which element is inside the preview area.
   * Returns {Element} the item being previewed.
   */
  PreviewScroll.prototype.findPreviewedItem = function () {
    var i = 0, distToTarget, itemHeights = 0, targetElem, currElem, currStyle,
      allItems = this.allItems,
      allItemsLen = this.allItemsLen,
      ul = this.ul;

    distToTarget = ul.scrollTop + (ul.offsetHeight / 2);

    for (i; i < allItemsLen; i += 1) {
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

  /**
   * @private
   * Snaps the previewed item within the bounds of the preview area.
   */
  PreviewScroll.prototype.snapToPreviewArea = function () {
    var scrollAnimation,
      animationId,
      self = this,
      target = self.findPreviewedItem(),
      targetTop = target.offsetTop - self.ul.scrollTop,
      prevAreaTop = self.previewArea.offsetTop - self.ul.offsetTop,
      compensate = targetTop - prevAreaTop,
      cycleCount = 0;

    scrollAnimation = function () {
      if (cycleCount >= Math.abs(compensate)) {
        cancelAnimationFrame(animationId);
        return;
      }
      self.ul.scrollTop += (compensate < 0) ? -1 : 1;
      cycleCount += 1;
      animationId = requestAnimationFrame(scrollAnimation);
    };

    animationId = requestAnimationFrame(scrollAnimation);
  };

  /**
   * @private
   * Detects when the user pauses/stops scrolling and snaps to the
   * preview area.
   */
  PreviewScroll.prototype.listenToScrollPauses = function () {
    var self = this, ul = this.ul, timeoutId, prevScroll;

    ul.addEventListener('scroll', function () {
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
        var targetItem;
        if (prevScroll === currScroll) {
          targetItem = self.findPreviewedItem();
          self.onPreview(targetItem);
          self.snapToPreviewArea();
        }
      }, defaultOpts.pause_time);

      prevScroll = currScroll;
    });
  };

  /**
   * @public
   * Updates the position of the preview area and scroll boundaries.
   * Should be called whenever the height of the ul changes.
   */
  PreviewScroll.prototype.updateLayout = function () {
    this.positionPreviewArea();
    this.ensureScrollBoundaries();
  };

  root.PreviewScroll = PreviewScroll;
}(this));