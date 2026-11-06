/* Never replace a visible pose with an image that has not been decoded. */
(function(){
  const pending=new WeakMap();
  function ready(image){
    if(!image)return Promise.reject(new Error('Missing pose image'));
    if(pending.has(image))return pending.get(image);
    const promise=(async()=>{
      if(!image.complete)await new Promise((resolve,reject)=>{
        const cleanup=()=>{image.removeEventListener('load',loaded);image.removeEventListener('error',failed);};
        const loaded=()=>{cleanup();resolve();};
        const failed=()=>{cleanup();reject(new Error('Pose image did not load'));};
        image.addEventListener('load',loaded,{once:true});
        image.addEventListener('error',failed,{once:true});
      });
      if(!image.naturalWidth)throw new Error('Pose image is empty');
      if(image.decode)await image.decode();
      return image;
    })();
    pending.set(image,promise);
    promise.catch(()=>pending.delete(image));
    return promise;
  }
  window.BendeguzPoses={ready};
})();
