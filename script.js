'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
// Node list (similar to array) - has some methods like forEach
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);
//   console.log(e.target.getBoundingClientRect());
//   console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
//   console.log(
//     'height/width viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );

//   // Scrolling
//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );

//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });

//   section1.scrollIntoView({
//     behavior: 'smooth',
//   });
// });

// Page naviagation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     // Stops it scrolling to the section
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Applying this to all btns / links can create an excessive amount of functions. We can apply it to parent elements to reduce the load.

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy - this only activates if what we clicked on matches the class we want
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    console.log('LINK');
  }
});

// This creates too many copies of the same function
// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));

// Use event delegation:
// Use .closest method so that whether we click on the text (span) or the button, JS always just looks for the closest button
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause - if what we have clicked on isn't 'clicked', finish the function
  if (!clicked) return;

  // Remove active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  // Active tab
  clicked.classList.add('operations__tab--active');
  // Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  // NOTE: dataset corresponds to the html attribute data-xxx with xxx coming after 'dataset'
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      //checks that the links aren't the one that we clicked on.
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Bind creates a copy of the function that it is called on.
// Passing 'argument' into handler - ebentlistener creates the argument (e)
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// Sticky navigation: Intersection Observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOptions = { root: null, threshold: [0, 0.2] };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight); // height: 90 - that's how tall the nav is

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // adds a margin to the section (the minus makes it so the section is that many pixels shorter - so event gets triggered earlier)
  rootMargin: `-${navHeight}px`,
  // NOTE: It's not a good idea to have this hardcoded - get the height dynamically by getBoundingClient (see 'height' variable)
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');
// Same as doing this?
// const imgTargs = document.querySelectorAll('.lazy-img');
// console.log(imgTargets, imgTargs);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  // Replace src attribute with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlide = slides.length;

// const slider = document.querySelector('.slider');
// slider.style.overflow = 'visible';
// slider.style.transform = 'scale(0.5) translateX(-700px)';

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

goToSlide(0);

// Next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
};
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
};
btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

/*
// ===== 186 - Selecting elements =====
// document.documentElement is the real DOM element
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
// Returns a node list - will not update the node list when elements are added / removed
const allSections = document.querySelectorAll('.section');

console.log(allSections);

document.getElementById('section--1');
// For HTML tags - returns HTML collection, which will be updated when you delete / add other html elements with same tag
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
console.log('-------');
console.log(document.getElementsByClassName('btn'));

// Creating & inserting elements

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent =
//   'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);

header.append(message);

// You can only have 1 version of a DOM element, so if you prepend, then append, it will overrite. So you can clone the element like this:
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

// ===== 187 - Styles, Attributes and Classes =====
// Styles

// See HTML header for reference

message.style.backgroundColor = '#37383d';
message.style.width = '120%';
// We can't access this because it's not an inline style (that we set in JS)
console.log(message.style.height);
// This works, as we set it
console.log(message.style.backgroundColor);
// We can access it this way
console.log(getComputedStyle(message).color);

// First we need to parse the value for a number (as it is in pixels)
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

// We can change CSS custom properties like this
// Root
document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes (src, alt, class, id etc.)
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src); // http://127.0.0.1:5500/img/logo.png -absolute filepath
console.log(logo.className);

// Changing the attribute
logo.alt = 'Beautiful, minimalist logo';
// Won't work because this attribute isn't expected in an img class
console.log(logo.designer);
// Can do it this way
console.log(logo.getAttribute('designer'));
// Set attribute - define the attribute, then the data
logo.setAttribute('company', 'Bankist');

logo.getAttribute('src');
console.log(logo.getAttribute('src')); // img/logo.png - relative filepath

const link = document.querySelector('.nav__link--btn');
console.log(link.href); // http://127.0.0.1:5500/index.html#
console.log(link.getAttribute('href')); // #

// Data attributes - special attributes that start with the word 'data'
// Use camelCase here, wheras in html it's dash
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j', 'o');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

// Don't use - it will overrite exising classes, and it only lets you add 1 class
logo.className = 'jonas';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// ===== 189 - Types of events and event handlers =====
const h1 = document.querySelector('h1');

// Remove event listeners at the same time
const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
  // h1.removeEventListener('mouseenter', alertH1);
};

// triggers when the mouse enters an area
h1.addEventListener('mouseenter', alertH1);

// Older way of listening for events:
// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// ===== 191 - Event propagation

// rgb(255, 255, 255);
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  // Stop propagation - stops propagation through parent elements
  // e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  },
  true // Capture parameter - this means you're getting data from the capture stage (not the bubbling), as the instructions pass through the DOM - so e.target will show NAV first because that's the highest parent element
);


// ===== 192 - Event delegation =====
// See page navigation in app section

// ===== 193 - Traversing the DOM

const h1 = document.querySelector('h1');

// Going down: children

console.log(h1.querySelectorAll('.highlight')); // NodeList(2) [span.highlight, span.highlight]
console.log(h1.childNodes); // NodeList(9) [text, comment, text, span.highlight, text, br, text, span.highlight, text]
// For DIRECT children
console.log(h1.children); // HTMLCollection(3) [span.highlight, br, span.highlight]
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'darkgreen';

// Going upwards: parents

console.log(h1.parentNode);

// Closest elements
h1.closest('.header').style.background = 'var(--gradient-secondary)';
// If you pass an argument in, which matches the initial element, and it doesn't have a parent, it will select itself (I think!?)
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// Nodes
console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});

*/
