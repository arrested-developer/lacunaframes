import Tweezer from 'tweezer.js';
import './style/style.scss';
import mapImage from './img/lacuna-map.jpg';

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

const makeControls = idArray => {
  idArray.forEach(id => {
    const paragraphs = Array.from(document.querySelectorAll(`${id} p`));
    if (paragraphs.length > 1) {
      let current = 0;
      const max = paragraphs.length - 1;
      const container = document.querySelector(`${id} .zoomContainer`);
      paragraphs.slice(1).map(p => (p.style.display = 'none'));
      const controls = document.createElement('div');
      controls.setAttribute('aria-hidden', 'true');
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
        showNext(paragraphs, current, -1000);
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
        showNext(paragraphs, current, 1000);
      });
      controls.classList.add('controls');
      controls.appendChild(back);
      controls.appendChild(next);
      container.appendChild(controls);
    }
  });
};

const showNext = (paragraphs, current, animateFrom) => {
  paragraphs.map(p => (p.style.display = 'none'));
  paragraphs[current].style.display = 'block';
  paragraphs[current].style.transform = `translateX(${animateFrom}px)`;
  new Tweezer({
    start: animateFrom,
    end: 0,
    duration: 400,
  })
    .on(
      'tick',
      x => (paragraphs[current].style.transform = `translateX(${x}px)`)
    )
    .begin();
};

makeControls(['#two', '#three']);

// use code below if removing pagination on larger screens

// const removeControls = idArray => {
//   idArray.forEach(id => {
//     const paragraphs = Array.from(document.querySelectorAll(`${id} p`));
//     paragraphs.map(p => (p.style.display = 'block'));
//   });
// };

// if (window.innerHeight < 500 || window.innerWidth < 540) {
//   makeControls(['#two', '#three']);
// }

// window.addEventListener('resize', () => {
//   if (window.innerHeight < 500 || window.innerWidth < 540) {
//     makeControls(['#two', '#three']);
//   } else {
//     removeControls(['#two', '#three']);
//   }
// });

const links = {
  one: document.querySelector('#one header a'),
  two: document.querySelector('#two header a'),
  three: document.querySelector('#three header a'),
  four: document.querySelector('#four header a'),
  map: document.querySelector('a[href="#map"]'),
};

const pageContainer = document.querySelector('.pageContainer');
let pageHeight = pageContainer.getBoundingClientRect().height;
window.addEventListener('resize', () => {
  pageHeight = pageContainer.getBoundingClientRect().height;
});

links.one.addEventListener('click', e => {
  e.preventDefault();
  showText('#one');
  smoothScroll(0);
});

links.two.addEventListener('click', e => {
  e.preventDefault();
  //window.scroll(0, window.innerHeight);
  smoothScroll(pageHeight);
});

links.three.addEventListener('click', e => {
  e.preventDefault();
  smoothScroll(pageHeight * 2);
});

links.four.addEventListener('click', e => {
  e.preventDefault();
  smoothScroll(pageHeight * 3);
});

const smoothScroll = pos => {
  const current = window.scrollY;
  new Tweezer({
    start: current,
    end: pos,
  })
    .on('tick', y => window.scrollTo(0, y))
    .begin();
};

const mapContainer = document.querySelector('#four .zoomContainer');
const mapCloser = document.createElement('a');
mapCloser.href = '#closemap';
mapCloser.title = 'Close Map';
const map = document.createElement('img');
map.src = mapImage;
map.alt = 'Location Map';
mapCloser.appendChild(map);
mapContainer.appendChild(mapCloser);
mapCloser.style.display = 'none';
mapCloser.addEventListener('click', e => {
  e.preventDefault();
  new Tweezer({
    start: 100,
    end: 0,
    duration: 300,
  })
    .on('tick', o => (mapCloser.style.opacity = o / 100))
    .on('done', () => (mapCloser.style.display = 'none'))
    .begin();
});

links.map.addEventListener('click', e => {
  e.preventDefault();
  if (mapCloser.style.display === 'none') {
    mapCloser.style.opacity = 0;
    mapCloser.style.display = 'block';
    new Tweezer({
      start: 0,
      end: 100,
      duration: 300,
    })
      .on('tick', o => (mapCloser.style.opacity = o / 100))
      .begin();
  }
});
