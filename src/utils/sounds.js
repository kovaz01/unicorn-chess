export const playSound = (type) => {
  const sounds = {
    move: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    lose: 'https://assets.mixkit.co/active_storage/sfx/2658/2658-preview.mp3',
    check: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
    hint: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
    invalid: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
    start: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    draw: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'
  }
  
  try {
    const audio = new Audio(sounds[type] || sounds.click)
    audio.volume = 0.3
    audio.play().catch(() => {})
  } catch (e) {}
}
