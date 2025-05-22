/**
 * この JavaScript は kViewer をカスタマイズします。
 * URL パラメータに direct が付いている場合のみ、
 * レコード一覧をスキップして詳細画面へリダイレクトします。
 *
 * 例:
 *   https://example.cybozu.com/k/#/viewer/app/99?direct         ← 遷移する
 *   https://example.cybozu.com/k/#/viewer/app/99?direct=1       ← 遷移する
 *   https://example.cybozu.com/k/#/viewer/app/99?direct=true    ← 遷移する
 *   https://example.cybozu.com/k/#/viewer/app/99                ← 遷移しない
 */

(function () {
  "use strict";
  console.log("begin");
  kviewer.events.on("records.show", (context) => {
    // URL パラメータをチェック
    const params = new URLSearchParams(location.search);
    const directVal = params.get("direct");

    // direct パラメータが無い、または 0 / false を明示している場合は何もしない
    const shouldRedirect =
      params.has("direct") &&
      (directVal === null ||
        directVal === "" ||
        directVal === "1" ||
        directVal.toLowerCase() === "true");

    if (!shouldRedirect) return;

    // レコードが 1 件だけなら詳細画面へ
    const records = context.records;
    if (records.length === 1) {
      const code = records[0].__kviewer_record_code__;
      location.href = `${location.origin}${location.pathname}/detail/${code}`;
    }
  });
})();
