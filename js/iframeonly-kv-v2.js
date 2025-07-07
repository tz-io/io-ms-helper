/**
 * kViewer iframe-guard v2.0
 *  - iframe 判定
 *  - postMessage で親ホストを受信（最優先）
 *  - document.referrer フォールバック
 *  - 許可ドメインは SHA-256 ハッシュで保持
 *  - デバッグログ切替可
 */
(() => {
  'use strict';

  /* ===== 設定 ===== */
  const DEBUG = false;   // 本番でログを消すなら false
  // 許可対象ドメインは echo -n portal.example.com | openssl dgst -sha256 | cut -d' ' -f2 で生成
  const ALLOWED_HASHES = [
    '55094ee5d2649d815a4274f70cf474558fcd4613d2707d4ea7add9f803b51728',
    '149356351fa57942f8753b1a629b4a30955dcec196222d60797272425096237b'
  ];
  /* ================ */

  const log = (...a) => DEBUG && console.log('[kViewer-iframe-guard]', ...a);
  let verdict = { allowed: false, source: 'pending', host: '' };

  /* 文字列 → SHA-256(hex) */
  async function sha256Hex(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str.toLowerCase()));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
  }

  /* ホスト名を検証して allowed フラグを更新 */
  async function evaluate(hostStr, via) {
    if (!hostStr) return;
    const hash = await sha256Hex(hostStr);
    verdict = { allowed: ALLOWED_HASHES.includes(hash), source: via, host: hostStr };
    log(verdict);
    if (!verdict.allowed) blockScreen();
	console.log('iframeonly38:'+erdict.allowed)
  }

  /* アクセス拒否 UI */
  function blockScreen() {
    document.body.innerHTML = '';
    const msg = document.createElement('div');
    msg.style.cssText = 'display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;text-align:center;';
    msg.innerHTML = '<h2 style="font-size:1.4rem;">このページは指定ポータルからのみアクセスできます。</h2>';
    document.body.appendChild(msg);

	location.href = 'https://tz-io.github.io/io-ms-helper/html/restricted_access.html';
  }

  /* 1) postMessage 受信（最優先） */
  window.addEventListener('message', e => {
    // 受信元チェック（kViewer のオリジンのみ許可）
    if (e.origin !== 'https://1c288017.viewer.kintoneapp.com') return;
    if (e.data?.host) evaluate(e.data.host, 'postMessage');
	console.log('iframeonly54:'+evaluate(e.data.host, 'postMessage'));
  });

  /* 2) view.show イベントでフォールバックロジック */
  kviewer.events.on('view.show', () => {
    (async () => {
      // iframe でない or 既に判定済み → 何もしない
      if (window.top === window.self || verdict.source !== 'pending') {
        if (window.top === window.self) verdict.allowed = false, verdict.source = 'not_iframe';
        if (!verdict.allowed) blockScreen();
		console.log('iframeonly64:');
		return;
      }

      /* window.top.location は同一オリジン時のみ読める */
//      try {
//        await evaluate(window.top.location.hostname, 'same_origin');
//        if (verdict.allowed) return;
//      } catch { /* ignore */ }

      /* document.referrer フォールバック */
//      const ref = document.referrer || '';
//      if (ref) {
//        try {
//          await evaluate(new URL(ref).hostname, 'referrer');
//        } catch { /* ignore */ }
//      }


      /* 最終判定 */
  	  console.log('iframeonly83:');
      if (!verdict.allowed) blockScreen();
    })();
  });
})();
