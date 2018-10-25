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
      .querySelectorAll('section')
      .forEach(section => (section.style.zIndex = 1));
    document.querySelector(id).style.zIndex = 999;
    document
      .querySelectorAll('.text-content')
      .forEach(elem => (elem.style.display = 'none'));
    document.querySelector(`${id} .text-content`).style.display = 'flex';
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

const makeControls = idArray => {
  idArray.forEach(id => {
    const paragraphs = Array.from(document.querySelectorAll(`${id} p`));
    if (paragraphs.length > 1) {
      let current = 0;
      const max = paragraphs.length - 1;
      const container = document.querySelector(`${id} .zoomContainer`);
      paragraphs.slice(1).map(p => (p.style.display = 'none'));
      const controls = document.createElement('div');
      const back = document.createElement('a');
      const next = document.createElement('a');
      back.innerText = '<';
      back.style.visibility = 'hidden';
      back.addEventListener('click', e => {
        e.preventDefault();
        current--;
        if (current < max) {
          next.style.visibility = 'visible';
        }
        if (current === 0) {
          e.target.style.visibility = 'hidden';
        }
        showNext(paragraphs, current);
      });
      next.innerText = '>';
      next.addEventListener('click', e => {
        e.preventDefault();
        current++;
        if (current === max) {
          e.target.style.visibility = 'hidden';
        }
        if (current > 0) {
          back.style.visibility = 'visible';
        }
        showNext(paragraphs, current);
      });
      controls.classList.add('controls');
      controls.appendChild(back);
      controls.appendChild(next);
      container.appendChild(controls);
    }
  });
};

const showNext = (paragraphs, current) => {
  paragraphs.map(p => (p.style.display = 'none'));
  paragraphs[current].style.display = 'block';
};

const removeControls = idArray => {
  idArray.forEach(id => {
    const paragraphs = Array.from(document.querySelectorAll(`${id} p`));
    paragraphs.map(p => (p.style.display = 'block'));
  });
};

if (window.innerHeight < 500 || window.innerWidth < 540) {
  makeControls(['#two', '#three']);
}

window.addEventListener('resize', () => {
  if (window.innerHeight < 500 || window.innerWidth < 540) {
    makeControls(['#two', '#three']);
  } else {
    removeControls(['#two', '#three']);
  }
});
