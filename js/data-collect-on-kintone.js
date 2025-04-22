(function () {
  'use strict';

  if (!window.hasOwnProperty("kintone")) {
    return;
  }

  var dataCollect = {
    rootDOMId: "data-collect-root",
    baseUrl: "https://datacollect.kintoneapp.com",
    token: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6Nzg3NH0._azIwYUdQLTW7XBvBMpE0VUlYpW4HP2QW7IgwwoVUJc",
    onAppIndex: false,
    onAppDetail: false
  };
  window._toyokumoDataCollect = dataCollect;

  var loadDataCollectJS = function () {
    if (document.getElementById("toyokumoDataCollect") === null) {
      var scriptElm = document.createElement("script");
      scriptElm.id = "toyokumoDataCollect";
      scriptElm.src = dataCollect.baseUrl + "/js/kintone-main.js";
      scriptElm.type = "text/javascript";
      document.body.appendChild(scriptElm);
    }
  };

  var addAppRootDOM = function (targetElm) {
    if (document.getElementById(dataCollect.rootDOMId) === null) {
      var root = document.createElement("div");
      root.id = dataCollect.rootDOMId;
      targetElm.appendChild(root);
    }
  };

  // 一覧画面で表示する
  kintone.events.on('app.record.index.show', function (event) {
    window._toyokumoDataCollect.onAppIndex = true;
    addAppRootDOM(kintone.app.getHeaderMenuSpaceElement());
    loadDataCollectJS();
    return event;
  });

  // 詳細画面で表示する
  kintone.events.on('app.record.detail.show', function (event) {
    window._toyokumoDataCollect.onAppDetail = true;
    addAppRootDOM(kintone.app.record.getHeaderMenuSpaceElement());
    loadDataCollectJS();
    return event;
  });
})();
