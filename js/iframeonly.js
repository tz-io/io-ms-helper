/**
 * kViewer – iframe 専用ビュー + ドメインホワイトリスト（SHA-256 ハッシュ版）
 * 1) iframe 内か判定
 * 2) 親ウィンドウのホスト名を SHA-256 でハッシュ化
 * 3) ハッシュが ALLOWED_HASHES に含まれているか確認
 */
(() => {
  'use strict';

  // ---------- ここに許可するドメインの SHA-256 ハッシュを列挙 ----------
  const ALLOWED_HASHES = [
    // kviewer.sandboxio.f5.si
    '55094ee5d2649d815a4274f70cf474558fcd4613d2707d4ea7add9f803b51728',
    // n8nai.sandboxio.f5.si
    '149356351fa57942f8753b1a629b4a30955dcec196222d60797272425096237b'
  ];
  // --------------------------------------------------------------------

  // 文字列を SHA-256（Hex）に変換
  async function sha256Hex(str) {
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(str.toLowerCase()) // 大文字小文字差をなくす
    );
    return [...new Uint8Array(buf)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // 非同期処理を組み込むため IIFE 内で async 関数を呼び出す
  kviewer.events.on('view.show', () => {
    (async () => {
      let isAllowed = false;

      try {
        // ① iframe 内判定
        if (window.top !== window.self) {
          // ② 親ホスト名取得
          const parentHost = window.top.location.hostname;
          // ③ ハッシュ化してホワイトリスト照合
          const hash = await sha256Hex(parentHost);
          console.log(hash);
          console.log(window.top.location.hostname);          
          isAllowed = ALLOWED_HASHES.includes(hash);
        }
      } catch (e) {
        // cross-origin で親 location に触れられない → 不許可
        isAllowed = false;
      }

      if (!isAllowed) {
        // 画面差し替え
        document.body.innerHTML = '';
        const msg = document.createElement('div');
        msg.style.cssText =
          'display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;text-align:center;';
        msg.innerHTML =
          '<h2 style="font-size:1.4rem;">このページは指定ポータルからのみアクセスできます。</h2>'+
          window.top.location.hostname+'  :  '
          hash+'  :  ';
        document.body.appendChild(msg);

        // 自動リダイレクト例（任意）
        //location.href = 'https://www.google.com/';
      }
    })();
  });
})();
