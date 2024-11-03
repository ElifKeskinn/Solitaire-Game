export const playSound = (soundFile) => {
    const audio = new Audio(`/assets/sounds/${soundFile}`);
    audio.play();
  };
