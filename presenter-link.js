/* Pair only the two views of this presentation; survive either view reloading. */
(function(){
  const params=new URLSearchParams(location.hash.slice(1));
  const random=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
  let session=params.get('show');
  if(!session||!/^[a-zA-Z0-9-]{8,80}$/.test(session)){
    session=random();params.set('show',session);
    history.replaceState(null,'',location.pathname+location.search+'#'+params);
  }
  window.BendeguzLink={
    windowName:'bendeguz-presenter-'+session,
    url(file){const url=new URL(file,location.href);url.hash=new URLSearchParams({show:session});return url.href;},
    connect(role,receive){
      const client=random(),seen=new Set(),peers=new Set();let sequence=0,channel=null;
      if(window.opener)peers.add(window.opener);
      function accept(message,source){
        if(!message||message.app!=='bendeguz'||message.session!==session||message.role===role||!['stage','presenter'].includes(message.role)||typeof message.id!=='string'||seen.has(message.id))return;
        if(source)peers.add(source);
        seen.add(message.id);if(seen.size>256)seen.delete(seen.values().next().value);
        receive(message.payload);
      }
      try{channel=new BroadcastChannel('bendeguz-show-'+session);channel.onmessage=e=>accept(e.data);}catch{}
      window.addEventListener('message',e=>{if(e.origin!==location.origin)return;accept(e.data,e.source);});
      return {
        addPeer(peer){if(peer)peers.add(peer);},
        send(payload){
          const message={app:'bendeguz',session,role,id:client+':'+(++sequence),payload};
          channel?.postMessage(message);
          for(const peer of peers){try{if(peer.closed)peers.delete(peer);else peer.postMessage(message,location.origin==='null'?'*':location.origin);}catch{peers.delete(peer);}}
        }
      };
    }
  };
})();
