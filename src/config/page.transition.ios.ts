import { Animation, PageTransition } from "ionic-angular";
import { isPresent } from "ionic-angular/util/util";

const DURATION = 500;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
const OPACITY = 'opacity';
const TRANSFORM = 'transform';
const TRANSLATEY = 'translateY';
const TRANSLATEX = 'translateX';
const SCALE = 'scale';
const OFF_SCALE = 0.97;
const CENTER = '0%';
const OFF_OPACITY = 0.6;
const SHOW_BACK_BTN_CSS = 'show-back-button';

export class OptimizedPageTransition extends PageTransition {
  init() {
    super.init();

    const plt = this.plt;
    const OFF_RIGHT = plt.isRTL ? '-100%' : '100%';
    const enteringView = this.enteringView;
    const leavingView = this.leavingView;
    const opts = this.opts;

    this.duration(isPresent(opts.duration) ? opts.duration : DURATION);
    this.easing(isPresent(opts.easing) ? opts.easing : EASING);

    const backDirection = (opts.direction === 'back');

    if (enteringView) {
      const enteringContent = new Animation(plt, enteringView.pageRef());

      this.add(enteringContent);

      if (backDirection) {
        enteringContent          
          .fromTo(SCALE, OFF_SCALE, 1, true)
          .fromTo(OPACITY, OFF_OPACITY, 1, false);
      }
      else {
        enteringContent
          .beforeClearStyles([OPACITY])
          .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
      }

      if (enteringView.isFirst()) {
        const enteringTabbarEle: Element = document.querySelector('.tabbar');
        const enteringTabbar = new Animation(plt, enteringTabbarEle);
        const enteringTabbarHeight = enteringTabbarEle.clientHeight;
        this.add(enteringTabbar);

        enteringTabbar
          .fromTo(TRANSLATEY, `${enteringTabbarHeight + 1}px`, 0, false);
      }

      if (enteringView.hasNavbar()) {
        const enteringPageEle: Element = enteringView.pageRef().nativeElement;
        const enteringNavbarEle: Element = enteringPageEle.querySelector('ion-navbar');
        const enteringNavBar = new Animation(plt, enteringNavbarEle);
        this.add(enteringNavBar);

        const enteringBackButton = new Animation(
          plt,
          enteringNavbarEle.querySelector('.back-button')
        );

        this.add(enteringBackButton);

        if (enteringView.enableBack()) {
          enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS);
        }
        else {
          enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
        }
      }
    }

    if (leavingView && leavingView.pageRef()) {
      const leavingContent = new Animation(plt, leavingView.pageRef());

      this.add(leavingContent);

      if (backDirection) {
        leavingContent
          .beforeClearStyles([OPACITY])
          .fromTo(TRANSLATEX, CENTER, (plt.isRTL ? '-100%' : '100%'));
      }
      else {
        leavingContent
          .fromTo(SCALE, 1, OFF_SCALE, true)
          .fromTo(OPACITY, 1, OFF_OPACITY, false)
          .afterClearStyles([TRANSFORM, OPACITY]);
      }

      if (leavingView.isFirst()) {
        const leavingTabbarEle: Element = document.querySelector('.tabbar');
        const leavingTabbar = new Animation(plt, leavingTabbarEle);
        const leavingTabbarHeight = leavingTabbarEle.clientHeight;
        this.add(leavingTabbar);

        leavingTabbar
          .fromTo(TRANSLATEY, 0, `${leavingTabbarHeight + 1}px`, false);
      }
    }
  }
}
