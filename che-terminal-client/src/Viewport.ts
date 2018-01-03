/**
 * @license MIT
 */

import { ITerminal } from './Interfaces';
import { CharMeasure } from './utils/CharMeasure';
import { ScrollBarMeasure } from './utils/ScrollBarMeasure';

/**
 * Represents the viewport of a terminal, the visible area within the larger buffer of output.
 * Logic for the virtual scroll bar is included in this object.
 */
export class Viewport {
  private currentRowHeight: number;
  private lastRecordedBufferLength: number;
  private lastRecordedViewportHeight: number;
  private lastRecordedViewportWidth = 0;

  /**
   * Creates a new Viewport.
   * @param terminal The terminal this viewport belongs to.
   * @param viewportElement The DOM element acting as the viewport.
   * @param scrollArea The DOM element acting as the scroll area.
   * @param charMeasureElement A DOM element used to measure the character size of. the terminal.
   */
  constructor(
    private terminal: ITerminal,
    private viewportElement: HTMLElement,
    private scrollArea: HTMLElement,
    private charMeasure: CharMeasure,
    private scrollBarMeasure: ScrollBarMeasure
  ) {
    this.currentRowHeight = 0;
    this.lastRecordedBufferLength = 0;
    this.lastRecordedViewportHeight = 0;

    this.terminal.on('scroll', this.syncScrollArea.bind(this));
    this.terminal.on('resize', this.syncScrollArea.bind(this));
    this.viewportElement.addEventListener('scroll', this.onScroll.bind(this));

    // Perform this async to ensure the CharMeasure is ready.
    setTimeout(() => this.syncScrollArea(), 0);
  }

  /**
   * Refreshes row height, setting line-height, viewport height and scroll area height if
   * necessary.
   * @param charSize A character size measurement bounding rect object, if it doesn't exist it will
   *   be created.
   */
  private refresh(): void {
    if (this.charMeasure.height > 0) {
      const rowHeightChanged = this.charMeasure.height !== this.currentRowHeight;
      if (rowHeightChanged) {
        this.currentRowHeight = this.charMeasure.height;
        this.viewportElement.style.lineHeight = this.charMeasure.height + 'px';
        this.terminal.rowContainer.style.lineHeight = this.charMeasure.height + 'px';
      }
      const viewportHeightChanged = this.lastRecordedViewportHeight !== this.terminal.rows;
      if (rowHeightChanged || viewportHeightChanged) {
        this.lastRecordedViewportHeight = this.terminal.rows;
        let newHeight = this.charMeasure.height * this.terminal.rows;
        if (this.terminal.readOnly) {
          this.viewportElement.style.height = '100%';
        } else {
          this.viewportElement.style.height = newHeight + 'px';
        }
      }
      this.scrollArea.style.height = (this.charMeasure.height * this.lastRecordedBufferLength) + 'px';

      let quantityRowSymbols = this.terminal.maxLineWidth === 0 ? this.terminal.cols : this.terminal.maxLineWidth;
      if (this.lastRecordedViewportWidth !== quantityRowSymbols) {
        this.lastRecordedViewportWidth = quantityRowSymbols;
        this.scrollArea.style.width =  Math.ceil(quantityRowSymbols * this.charMeasure.width) + 'px';
      }
    }
  }

  /**
   * Updates dimensions and synchronizes the scroll area if necessary.
   */
  public syncScrollArea(): void {
    if (this.lastRecordedBufferLength !== this.terminal.lines.length) {
      // If buffer height changed
      this.lastRecordedBufferLength = this.terminal.lines.length;
      this.refresh();
    } else if (this.lastRecordedViewportHeight !== this.terminal.rows) {
      // If viewport height changed
      this.refresh();
    } else {
      // If size has changed, refresh viewport
      if (this.charMeasure.height !== this.currentRowHeight ||
          this.lastRecordedViewportWidth !== this.terminal.maxLineWidth) {
        this.refresh();
      }
    }

    // Sync scrollTop
    const scrollTop = this.terminal.ydisp * this.currentRowHeight;
    if (this.viewportElement.scrollTop !== scrollTop) {
      this.viewportElement.scrollTop = scrollTop;
    }
  }

  /**
   * Handles scroll events on the viewport, calculating the new viewport and requesting the
   * terminal to scroll to it.
   * @param ev The scroll event.
   */
  private onScroll(ev: Event) {
    const newRow = Math.round(this.viewportElement.scrollTop / this.currentRowHeight);
    const diff = newRow - this.terminal.ydisp;
    this.terminal.scrollDisp(diff, true);
    if (this.terminal.readOnly) {
      this.terminal.rowContainerWrapper.scrollLeft = this.viewportElement.scrollLeft;
    }
  }

  /**
   * Handles mouse wheel events by adjusting the viewport's scrollTop and delegating the actual
   * scrolling to `onScroll`, this event needs to be attached manually by the consumer of
   * `Viewport`.
   * @param ev The mouse wheel event.
   */
  public onWheel(ev: WheelEvent) {
    if (ev.deltaY === 0) {
      // Do nothing if it's not a vertical scroll event
      return;
    }
    // Fallback to WheelEvent.DOM_DELTA_PIXEL
    let multiplier = 1;
    if (ev.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      multiplier = this.currentRowHeight;
    } else if (ev.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      multiplier = this.currentRowHeight * this.terminal.rows;
    }
    this.viewportElement.scrollTop += ev.deltaY * multiplier;
    // Prevent the page from scrolling when the terminal scrolls
    ev.preventDefault();
  };
}
