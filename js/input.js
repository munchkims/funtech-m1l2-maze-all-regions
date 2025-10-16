import { onMoveKey } from './game.js';

export function attachInput(){
  document.addEventListener('keydown', (e)=>{
    // блокируем прокрутку/назад
    if (e.keyCode === 32 || e.keyCode === 8){
      e.preventDefault();
    }
    onMoveKey(e.keyCode);
  }, {passive:false});
}
