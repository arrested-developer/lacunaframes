// import styles
import './style.scss';

// rotate sections to starting points
window.addEventListener('scroll', () => {
  const scrollTracker = document.getElementById('scrollTracker');
  const pageContainer = document.querySelector('.pageContainer');
  const frame = document.querySelector('#frame');
  const spinContainers = document.querySelectorAll('.spinContainer');
  const zoomContainers = document.querySelectorAll('.zoomContainer');
  const textContainers = document.querySelectorAll('.text-content');
  const pageHeight = pageContainer.getBoundingClientRect().height;
  const scrolledDist = scrollTracker.getBoundingClientRect().top;
  let rotation = (scrolledDist / (pageHeight * 3)) * 270;
  const setRotation = rotation > 0 ? 0 : rotation < -270 ? -270 : rotation;
  const zoomFactor = Math.cos((setRotation / 135) * ((3 * Math.PI) / 2));
  console.log(zoomFactor);
  zoomContainers.forEach(
    container => (container.style.transform = `scale(${Math.abs(zoomFactor)})`)
  );
  frame.style.transform = `rotate(${setRotation}deg)`;
  spinContainers.forEach(
    container => (container.style.transform = `rotate(${setRotation}deg)`)
  );
  textContainers.forEach(
    container => (container.style.transform = `rotate(${setRotation}deg)`)
  );
  const showText = id => {
    document
      .querySelectorAll('.text-content')
      .forEach(elem => (elem.style.opacity = 0));
    document.querySelector(`${id} .text-content`).style.opacity = 1;
  };
  if (setRotation < 0 && setRotation > -45) {
    showText('#one');
  } else if (setRotation < -45 && setRotation > -135) {
    showText('#two');
  } else if (setRotation < -135 && setRotation > -225) {
    showText('#three');
  } else if (setRotation < -225) {
    showText('#four');
  }
});
