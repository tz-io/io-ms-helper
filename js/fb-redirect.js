(function () {
  "use strict";

    console.log("送信完了画面に到達しました。");

    // クエリパラメータを取得する関数
    function getQueryParams() {
      const queryString = window.location.search.slice(1); // 「?」を取り除く
      const params = {};
      queryString.split("&").forEach(function(param) {
        const [key, value] = param.split("=");
        params[key] = decodeURIComponent(value || "");
      });
      return params;
    }

    // パラメータを取得
    const params = getQueryParams();
    const subdomain = params["__kViewerSubdomain__"];
    const viewCode = params["__kViewerViewCode__"];
    const recordCode = params["__kViewerRecordCode__"];

    // リダイレクト先URLの組み立て
    // ルール: https://{subdomain}.viewer.kintoneapp.com/public/{viewCode}/detail/{recordCode}
    const redirectTo = `https://${subdomain}.viewer.kintoneapp.com/public/${viewCode}/detail/${recordCode}`;

  // 完了画面が表示されたときにリダイレクト
  formBridge.events.on('finish.show', function (context) {
    parent.location.href = redirectTo;
  });

})();
