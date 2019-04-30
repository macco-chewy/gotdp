const GAID = process.env.REACT_APP_STAGE === 'prod' ? 'UA-139327182-1' : 'UA-139327182-2';

function initGA() {
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] =
      i[r] ||
      function () {
        (i[r].q = i[r].q || []).push(arguments);
      };
    i[r].l = 1 * new Date();
    a = s.createElement(o);
    m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(
    window,
    document,
    'script',
    'https://www.google-analytics.com/analytics.js',
    'ga'
  );

  // create a new collection for each tracker
  window.gaTrackers = [];

  let gaIds = [{ gaId: GAID, trackerName: 'gotdpTracker' }];

  gaIds.forEach(gaIdConf => {
    window.ga('create', gaIdConf.gaId, 'auto', gaIdConf.trackerName);
    window.gaTrackers.push(gaIdConf.trackerName);
  });
};

export function sendGAPageView(page) {
  if (!window.ga || !window.gaTrackers) {
    initGA();
  }

  window.gaTrackers.forEach(tracker => {
    window.ga(`${tracker}.set`, 'page', page);
    window.ga(`${tracker}.send`, 'pageview');
  });
}

export function sendGALoadTiming(page, duration) {
  if (!window.ga || !window.gaTrackers) {
    initGA();
  }

  window.gaTrackers.forEach(tracker => {
    window.ga(`${tracker}.send`, {
      hitType: 'timing',
      timingCategory: 'LoadTime',
      timingVar: 'load',
      timingValue: duration
    });
  });
}

export function sendGAScreenViewDuration(page, duration) {
  if (!window.ga || !window.gaTrackers) {
    initGA();
  }

  window.gaTrackers.forEach(tracker => {
    window.ga(`${tracker}.send`, {
      hitType: 'timing',
      timingCategory: 'ScreenViewDuration',
      timingVar: 'ViewDuration',
      timingValue: duration,
      timingLabel: 'ViewDuration'
    });
  });
}
