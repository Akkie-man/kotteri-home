/*
 * こってり開発部 ホームサイト 広告モジュール(Google AdSense 手動広告)
 *
 * 設定はこのファイル冒頭の AD_CONFIG だけです。クライアントID・スロットID・有効/無効はここ以外に書きません。
 * 広告枠は HTML 側の <div class="ad-slot" data-ad-placement="..."></div> だけ(IDは持たない)。
 * 広告枠を置くページは build-content.cjs が管理します(ARTICLE-GUIDE.md 参照)。
 *
 * 守っていること:
 *  - <html> / <body> には広告関連の class も属性も付けない。失敗状態は window.__adLoadFailed と、
 *    広告枠(.ad-slot)自身の data-ad-state だけで持つ。
 *  - 広告枠は data-ad-status="filled" を確認するまで、ラベル・罫線・余白を出さない(幅だけ持つ高さ0の箱)。
 *  - 未配信・読み込み失敗・ブロック時は広告枠だけを hidden にする。本文・メニュー・リンクには触れない。
 *  - adsbygoogle.js は文書ごとに1回だけ読み込む。
 *  - 広告リクエスト(push)は、広告枠が非表示でなく、幅が確定してから、広告要素ごとに1回だけ。
 *  - 広告要素は一度作ったら保持する。定期的な広告更新はしない。
 *  - 広告コードには個人情報・認証情報・ページ内容を渡さない(標準属性のみ)。
 */
(function () {
  'use strict';

  // 同じ文書でこのファイルが2回読み込まれても、初期化は1回だけ。
  if (window.__kotteriAdsLoaded) return;
  window.__kotteriAdsLoaded = true;

  // ===== 共通設定 ====================================================================
  var AD_CONFIG = {
    enabled: true,                          // false にすると全ページで広告を出さない(スクリプトも読み込まない)
    client: 'ca-pub-4960959858706803',      // AdSense パブリッシャーID
    slot: '5131406666',                     // ホームページ用 広告ユニット(全配置で共用)
    scriptSrc: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    minWidth: 120,                          // この幅(px)未満では広告をリクエストしない
    rootMargin: '300px 0px'                 // 画面の手前この距離に来たら要求する(下の方の枠を無駄に要求しない)
  };
  // ===================================================================================

  window.__adLoadFailed = window.__adLoadFailed || false;

  var records = [];          // { slot, ins, requested }
  var scriptRequested = false;

  function setState(slot, state) {
    slot.setAttribute('data-ad-state', state);
  }

  function hideSlot(slot, state) {
    setState(slot, state);
    slot.hidden = true;
  }

  // ---- adsbygoogle.js(文書ごとに1回) ----
  function ensureScript() {
    if (scriptRequested) return;
    scriptRequested = true;
    if (document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = AD_CONFIG.scriptSrc + '?client=' + encodeURIComponent(AD_CONFIG.client);
    s.onerror = markFailed;
    document.head.appendChild(s);
  }

  // スクリプトの読み込み失敗(ブロッカー・通信失敗): 広告枠だけを消す。
  function markFailed() {
    window.__adLoadFailed = true;
    for (var i = 0; i < records.length; i++) hideSlot(records[i].slot, 'failed');
  }

  // ---- 配信状態の監視(data-ad-status) ----
  function applyStatus(rec) {
    var st = rec.ins.getAttribute('data-ad-status');
    if (st === 'filled') {
      // ブロッカーが広告要素だけを隠している場合は、ラベルも出さない。
      if (!rec.ins.getClientRects().length || getComputedStyle(rec.ins).visibility === 'hidden') {
        hideSlot(rec.slot, 'blocked');
        return;
      }
      rec.slot.hidden = false;
      setState(rec.slot, 'filled');
    } else if (st === 'unfilled') {
      hideSlot(rec.slot, 'unfilled');
    }
  }

  function watch(rec) {
    applyStatus(rec); // 初期化時にすでに filled の場合にも対応
    if (!window.MutationObserver) return;
    new MutationObserver(function () { applyStatus(rec); })
      .observe(rec.ins, { attributes: true, attributeFilter: ['data-ad-status'] });
  }

  // ---- リクエスト(広告要素ごとに1回) ----
  function eligible(slot) {
    if (!slot.isConnected || slot.hidden) return false;
    if (!slot.getClientRects().length) return false;                 // display:none など
    if (getComputedStyle(slot).visibility === 'hidden') return false;
    return slot.getBoundingClientRect().width >= AD_CONFIG.minWidth;  // 幅が確定している
  }

  function request(rec) {
    if (rec.requested || window.__adLoadFailed) return true;
    if (!eligible(rec.slot)) return false;
    rec.requested = true;

    // push は「DOM上で最初の未処理の ins」に作用するため、ins はリクエストの直前に作る。
    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', AD_CONFIG.client);
    ins.setAttribute('data-ad-slot', AD_CONFIG.slot);
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    rec.slot.appendChild(ins);
    rec.ins = ins;
    watch(rec);

    ensureScript();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      hideSlot(rec.slot, 'error');
    }
    return true;
  }

  function init() {
    var nodes = document.querySelectorAll('.ad-slot[data-ad-placement]');
    if (!nodes.length) return; // 広告枠のないページでは何も読み込まない

    for (var i = 0; i < nodes.length; i++) {
      var slot = nodes[i];
      if (slot.getAttribute('data-ad-state')) continue; // 初期化済みの枠は触らない
      if (!AD_CONFIG.enabled || window.__adLoadFailed) { hideSlot(slot, 'disabled'); continue; }
      setState(slot, 'pending');
      var existing = slot.querySelector('ins.adsbygoogle');
      if (existing) {
        // すでに広告要素がある枠(再初期化など)は作り直さず、そのまま引き継ぐ。filled 済みなら即ラベルを出す。
        var adopted = { slot: slot, ins: existing, requested: true };
        records.push(adopted);
        watch(adopted);
        continue;
      }
      records.push({ slot: slot, ins: null, requested: false });
    }
    if (!records.length) return;

    // 幅が測れるまで待ち、測れたら1回だけリクエストする。
    function tryAll() {
      var pending = 0;
      for (var i = 0; i < records.length; i++) {
        if (!records[i].requested && !request(records[i])) pending++;
      }
      return pending;
    }

    function onNear(rec) {
      if (request(rec)) return;
      // 幅がまだ0なら、サイズが変わった時に再試行する。
      if (window.ResizeObserver) {
        var ro = new ResizeObserver(function () {
          if (request(rec)) ro.disconnect();
        });
        ro.observe(rec.slot);
      }
    }

    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (!entries[i].isIntersecting) continue;
          var rec = null;
          for (var j = 0; j < records.length; j++) if (records[j].slot === entries[i].target) rec = records[j];
          io.unobserve(entries[i].target);
          if (rec) onNear(rec);
        }
      }, { rootMargin: AD_CONFIG.rootMargin });
      for (var k = 0; k < records.length; k++) io.observe(records[k].slot);
    } else {
      // IntersectionObserver がない古いブラウザ: 読み込み完了後に要求する。
      var run = function () { tryAll(); };
      if (document.readyState === 'complete') run();
      else window.addEventListener('load', run);
      window.addEventListener('resize', run);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
