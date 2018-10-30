import Tweezer from 'tweezer.js';
import './style/style.scss';
import mapImage from './img/lacuna-map.jpg';
(() => {
  // add scroll event to rotate page
  window.addEventListener('scroll', () => {
    // scrollTracker starts at top of page, helps to calculate where user has scrolled to
    const scrollTracker = document.getElementById('scrollTracker');
    const pageContainer = document.querySelector('.pageContainer');
    // elements to rotate and zoom
    const frame = document.querySelector('#frame');
    const spinContainers = document.querySelectorAll('.spinContainer');
    const zoomContainers = document.querySelectorAll('.zoomContainer');
    const textContainers = document.querySelectorAll('.text-content');
    // get real page height so it's correct on iPhones
    const pageHeight = pageContainer.getBoundingClientRect().height;
    const scrolledDist = scrollTracker.getBoundingClientRect().top;
    // calculate rotation in degrees from 0 - 360
    let rotation = (scrolledDist / (pageHeight * 4)) * 360;
    const setRotation = rotation > 0 ? 0 : rotation < -360 ? -360 : rotation;
    // rotate frame, header containers, text containers
    frame.style.transform = `rotate(${setRotation}deg)`;
    spinContainers.forEach(
      container => (container.style.transform = `rotate(${setRotation}deg)`)
    );
    textContainers.forEach(
      container => (container.style.transform = `rotate(${setRotation}deg)`)
    );
    // use cosine to give value between 0 and 1 which is max at 90deg intervals
    const zoomFactor = Math.cos((setRotation / 180) * ((4 * Math.PI) / 2));
    // scale inner content
    zoomContainers.forEach(
      container =>
        (container.style.transform = `scale(${Math.abs(zoomFactor)})`)
    );
    // show only the relevant text content
    if ((setRotation < 0 && setRotation > -45) || setRotation < -315) {
      showText('#one');
    } else if (setRotation < -45 && setRotation > -135) {
      showText('#two');
    } else if (setRotation < -135 && setRotation > -225) {
      showText('#three');
    } else if (setRotation < -225 && setRotation > -315) {
      showText('#four');
    }
    // if end of page reached, jump back to 0,0 - creates infinite downward scrolling
    if (setRotation === -360) {
      window.scrollTo(0, 1);
    }
    // if (setRotation === -0) {
    //   window.scrollTo(0, pageHeight * 4);
    // }
  });

  // show text in the chosen section by id (#one, #two, etc.) and hide others
  // use opacity so that text is visible for screen readers
  const showText = id => {
    document
      .querySelectorAll('section')
      .forEach(section => (section.style.zIndex = 1));
    document.querySelector(id).style.zIndex = 999;
    document
      .querySelectorAll('.text-content')
      .forEach(elem => (elem.style.opacity = 0));
    document.querySelector(`${id} .text-content`).style.opacity = 1;
  };

  // check for multiple paragraps in sections (given array of section ids)
  // if > 1 paragraph, paginate with back and next arrows
  // animate in and out
  const makeControls = idArray => {
    idArray.forEach(id => {
      const paragraphs = Array.from(document.querySelectorAll(`${id} p`));
      if (paragraphs.length > 1) {
        let current = 0;
        const max = paragraphs.length - 1;
        const container = document.querySelector(`${id} .zoomContainer`);
        paragraphs.slice(1).map(p => {
          p.style.transform = 'translateX(1000px)';
          p.style.opacity = 0;
        });
        const controls = document.createElement('div');
        // hide controls from screen reader as text is only hidden visually
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

  // show next or prev paragraph (use index of paragraph from paragraphs array)
  // animateFrom takes a pixel distance to the right (+) or left (-)
  const showNext = (paragraphs, current, animateFrom) => {
    if (animateFrom > 0) {
      new Tweezer({
        start: 0,
        end: -1 * animateFrom,
        duration: 400,
      })
        .on(
          'tick',
          x => (paragraphs[current - 1].style.transform = `translateX(${x}px)`)
        )
        .on('done', () => (paragraphs[current - 1].style.opacity = 0))
        .begin();
    } else {
      new Tweezer({
        start: 0,
        end: -1 * animateFrom,
        duration: 400,
      })
        .on(
          'tick',
          x => (paragraphs[current + 1].style.transform = `translateX(${x}px)`)
        )
        .on('done', () => (paragraphs[current + 1].style.opacity = 0))
        .begin();
    }
    paragraphs[current].style.opacity = 1;
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

  // add controls for paragraphs two and three if needed.
  makeControls(['#two', '#three']);

  // set up click events for navigation links
  const links = {
    one: document.querySelector('#one header a'),
    two: document.querySelector('#two header a'),
    three: document.querySelector('#three header a'),
    four: document.querySelector('#four header a'),
    map: document.querySelector('a[href="#map"]'),
  };

  // get page height as height of 100vh container (important to work correctly
  // with iPhone when not showing on full screen)
  const pageContainer = document.querySelector('.pageContainer');
  let pageHeight = pageContainer.getBoundingClientRect().height;
  // recalculate if page height changes
  window.addEventListener('resize', () => {
    pageHeight = pageContainer.getBoundingClientRect().height;
  });

  links.one.addEventListener('click', e => {
    e.preventDefault();
    showText('#one');
    // rotate 'forwards' to end of page, where scrolling will jump back to 0,0
    smoothScroll(pageHeight * 4);
  });

  links.two.addEventListener('click', e => {
    e.preventDefault();
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

  // use tweening to achieve smooth scroll
  const smoothScroll = pos => {
    const current = window.scrollY;
    new Tweezer({
      start: current,
      end: pos,
    })
      .on('tick', y => window.scrollTo(0, y))
      .begin();
  };

  // set up map display - show or hide the map
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
  // hide map when map itself is clicked
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

  // show map when 'map' link is clicked
  links.map.addEventListener('click', e => {
    e.preventDefault();
    // only show map if it is not already showing
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
})();
