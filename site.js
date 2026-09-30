// こってり開発部 共通スクリプト: 日本語を文節単位で折り返す。本文の文字・順序は一切変えない。
(function(){
  function phrasing(root){
    if(!window.Intl||!Intl.Segmenter)return;
    var seg=new Intl.Segmenter('ja',{granularity:'word'});
    var JP=/[\u3040-\u30ff\u3400-\u9fff]/, HIRA=/^[\u3040-\u309f]+$/, KANJI1=/^[\u4e00-\u9fff]$/, CLOSE=/^[、。，．！？」』）】・…]+$/, OPEN=/^[「『（【]+$/;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      if(!JP.test(n.nodeValue))return NodeFilter.FILTER_REJECT;
      var t=n.parentElement&&n.parentElement.tagName;
      if(t==='SCRIPT'||t==='STYLE'||n.parentElement.closest('.ph'))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT}});
    var nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    for(var ni=0;ni<nodes.length;ni++){
      var node=nodes[ni];
      var original=node.nodeValue;
      var parts=[],cur='',carry='',lat='';
      function flushLat(){ if(!lat)return; var m=lat.match(/^(\s*)(.*?)(\s*)$/); 
        if(m[1])parts.push([m[1],false]); if(m[2])parts.push([m[2],m[2].length<=40&&/[A-Za-z0-9]/.test(m[2])]); if(m[3])parts.push([m[3],false]); lat=''; }
      function flush(){ flushLat(); if(cur){parts.push([cur,true]);cur=''} }
      var segments=seg.segment(original);
      var it=segments[Symbol.iterator](); var r;
      while(!(r=it.next()).done){
        var segment=r.value.segment;
        if(OPEN.test(segment)){ flush(); carry+=segment; continue; }
        if(CLOSE.test(segment)){ flushLat(); if(carry){cur+=carry;carry=''} cur+=segment; continue; }
        if(!JP.test(segment)){
          if(cur){parts.push([cur,true]);cur=''} if(carry){lat+=carry;carry=''} lat+=segment; continue; }
        flushLat();
        if(cur&&!carry&&HIRA.test(segment)&&segment.length<=3){cur+=segment;continue}
        if(cur&&!carry&&KANJI1.test(segment)&&/[\u4e00-\u9fff]$/.test(cur)){cur+=segment;continue}
        flush(); cur=carry+segment; carry='';
      }
      if(carry){cur+=carry;carry=''}
      flush();
      var joined=''; for(var pi=0;pi<parts.length;pi++)joined+=parts[pi][0];
      if(joined!==original)continue;
      var frag=document.createDocumentFragment();
      for(var qi=0;qi<parts.length;qi++){
        var text=parts[qi][0],wrap=parts[qi][1];
        if(wrap){var sp=document.createElement('span');sp.className='ph';sp.textContent=text;frag.append(sp)}
        else frag.append(document.createTextNode(text));
      }
      node.replaceWith(frag);
    }
  }
  window.phrasing=phrasing;
  // このスクリプトはbody末尾に置く前提。実行時点で先行するDOMは構築済みなので、そのまま1回だけ実行する。
  phrasing(document.body);
})();
