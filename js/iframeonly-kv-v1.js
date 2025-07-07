/**
 * kViewer v1 – iframe guard with domain hash
 * (function() { ... })(); の IIFE で global 汚染を防ぐ
 */
(function () {
  'use strict';

  /* ===== 設定 ===== */
  const DEBUG = false;   // 本番は false
  // 許可対象ドメインのハッシュ値は echo -n portal.example.com | openssl dgst -sha256 | cut -d' ' -f2 で生成  
  const ALLOWED_HASHES = [
    '55094ee5d2649d815a4274f70cf474558fcd4613d2707d4ea7add9f803b51728',
    '149356351fa57942f8753b1a629b4a30955dcec196222d60797272425096237b'
  ];
  /* =============== */

  const log = (...a) => DEBUG && console.log('[kv-iframe-guard]', ...a);

  // SHA-256 を計算（Hex 文字列へ）
  function sha256Hex(str) {
    return crypto.subtle.digest('SHA-256',
      new TextEncoder().encode(str.toLowerCase()))
      .then(buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join(''));
  }

  // アクセス拒否画面
  function block() {
    document.body.innerHTML =
      '<div style="display:flex;justify-content:center;align-items:center;height:100vh;">'
    + '<h2>このページは指定ポータルからのみアクセスできます。</h2></div>';

	location.href = 'https://tz-io.github.io/io-ms-helper/html/restricted_access.html';
  }

  // postMessage 受信 → 検証
  window.addEventListener('message', evt => {
    if (evt.origin !== 'https://1c288017.viewer.kintoneapp.com') return; // オリジン検証
    if (!evt.data || !evt.data.host) return;
    sha256Hex(evt.data.host).then(hash => {
      if (!ALLOWED_HASHES.includes(hash)) block();
      else log('allowed by postMessage');
    });
  });

  // DOM 完成後のイベント（同期戻り値必要）
  kv.events.view.mounted = [function (state) {
    // parentHost を取れたら早めに判定。同一オリジン時のみ読める
    try {
      const host = window.top.location.hostname;
      sha256Hex(host).then(hash => {
        if (!ALLOWED_HASHES.includes(hash)) block();
        else log('allowed by same-origin');
      });
    } catch (e) {
      // cross-origin → Referrer 経由フォールバック
      const ref = document.referrer;
      if (ref) {
        const host = new URL(ref).hostname;
        sha256Hex(host).then(hash => {
          if (!ALLOWED_HASHES.includes(hash)) block();
          else log('allowed by referrer');
        });
      } else {
        // postMessage が届くまで待機、届かなければ最終的にブロック
        setTimeout(() => document.body.innerHTML || block(), 2000);
      }
    }
    return state; // v1 は state を戻す
  }];
})();
