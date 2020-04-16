import Lectures from './lectures.js';
import LectureLocalStorage from './localStorage.js';
import { el } from './helpers.js';

document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');
  const btnHtml = document.querySelector('.fyrirlestrar__html.fyrirlestrar__btn');// html takki
  const btnCss = document.querySelector('.fyrirlestrar__css.fyrirlestrar__btn'); // css takki
  const btnJava = document.querySelector('.fyrirlestrar__javascript.fyrirlestrar__btn');// js takki
  const fyrirlestrar = document.querySelector('.fyrirlestrar'); // fyrirlestra div
  let html; // html button
  let css; // css button
  let java; // js button
  let child; // börn fyrirlestra
  let hlekkur = window.location.href; // sækir hlekkinn
  let data; // breyta til að ná í lecture með slug
  const atag = document.querySelector('.lecture__last-pt'); // sækir klára fyrirlestur textan neðst í fyrirlestur.html
  const klara = document.querySelector('.lecture__last-pk'); // sækir til baka textan neðst í fyrirlestur.html


  /**
 * Athuga finna hvaða lecture svarar til div taggið
 * sem smellt er á
 * @param {compareDivId} e elementið sem smellt er á
 */
  function compareDivId(e) {
    let eventId;
    if (e.target.id) {
      eventId = e.target.id;
    } else if (e.target.parentNode.id) {
      eventId = e.target.parentNode.id;
    } else if (e.target.parentNode.parentNode.id) {
      eventId = e.target.parentNode.parentNode.id;
    } else {
      eventId = e.target.parentNode.parentNode.parentNode.id;
    }
    for (let i = 0; i < Lectures.getLecturesArray().length; i += 1) {
      if (eventId === Lectures.getLecturesArray()[i].slug) {
        data = Lectures.getLectureBySlug(eventId);
      }
    }
    localStorage.setItem('data', JSON.stringify(data));
    hlekkur += `fyrirlestur.html?slug=${eventId}`;
    window.location.href = hlekkur;
  }
  /**
   * Sækir hlutinn sem smellt var á
   */
  function getClickedItem() {
    for (let x = 0; x < fyrirlestrar.children.length; x += 1) {
      child = fyrirlestrar.children[x];
      child.addEventListener('click', compareDivId);
    }
  }
  /**
   * Sækir gogn og stillir upp fyrirlestur
   * @param {*} gogn strengur með uppl um gögn
   * @param {*} json json af gogn
   */
  function initFyrirlestur(gogn, json) {
    const img = document.querySelector('.header__img');
    const p = document.querySelector('.header-p');
    const h1 = document.querySelector('.header-h1');
    if (!json.image) {
      const header = document.querySelector('.header');
      header.classList.add('quote');
      img.parentNode.removeChild(img);
    } else {
      img.src = json.image;
    }
    p.innerHTML = json.category.toUpperCase();
    h1.innerHTML = json.title;
    document.title = json.title;
  }
  /**
   * Sækir content fyrir síðu og bætir því í elementum ásamt því að birta á síðu
   * @param {*} content json af contenti
   */
  function uploadContent(content) {
    const lecture = document.querySelector('.lecture');
    const firstChild = lecture.childNodes[0];
    for (let i = 0; i < content.length; i += 1) {
      const div = el('div');
      div.classList.add('lecture__div');
      if (content[i].type === 'youtube') {
        const iframe = el('iframe');
        iframe.classList.add('lecture__iframe--vid');
        div.classList.add('lecture__iframe');
        iframe.src = content[i].data;
        iframe.frameborder = 0;
        iframe.allowfullscreen = 0;
        div.appendChild(iframe);
      }
      if (content[i].type === 'image') {
        const img = el('img');
        img.classList.add('lecture__image');
        const p = el('p', content[i].caption);
        p.classList.add('lecture__p--image');
        p.style = 'font-style: italic';
        img.src = content[i].data;
        div.appendChild(img);
        div.appendChild(p);
      }
      if (content[i].type === 'text') {
        const p = el('p');
        p.classList.add('lecture__p');
        p.style = 'line-height: 2;';
        const texti = content[i].data.replace(/\n/g, '<br /><br />');
        p.innerHTML = texti;
        div.appendChild(p);
      }
      if (content[i].type === 'quote') {
        const p = el('p', content[i].data);
        const atr = el('p', content[i].attribute);
        atr.style = 'font-style: italic';
        div.classList.add('quote'); // gefa því gráan kassa
        p.classList.add('quote__p');
        div.appendChild(p);
        div.appendChild(atr);
      }
      if (content[i].type === 'heading') {
        const h1 = el('h1', content[i].data);
        h1.classList.add('lecture__h1');
        div.appendChild(h1);
      }
      if (content[i].type === 'list') {
        const list = el('ul');
        list.classList.add('.lecture__ul');
        let li;
        let p;
        for (let k = 0; k < content[i].data.length; k += 1) {
          p = el('p', content[i].data[k]);
          p.classList.add('lecture__p');
          li = el('li');
          li.appendChild(p);
          list.appendChild(li);
          list.appendChild(el('br'));
        }
        div.appendChild(list);
      }
      if (content[i].type === 'code') {
        if (/<\/?[a-z][\s\S]*>/i.test(content[i].data)) {
          const p = el('p', content[i].data);
          p.style = 'white-space:pre-wrap';
          div.appendChild(p);
        } else {
          const p = el('p');
          const texti = content[i].data.replace(/\n/g, '<br />');
          p.innerHTML = texti;
          div.appendChild(p);
        }
      }
      lecture.insertBefore(div, firstChild);
    }
  }
  /**
   * on click fall fyrir til baka
   */
  function tilBaka() {
    const n = hlekkur.lastIndexOf('/');
    hlekkur = hlekkur.substring(0, n);
    window.location.href = hlekkur;
  }
  /**
   * onclick fall til þess að savea fyrirlestur
   * @param {*} e  p tag click event
   */
  function finishContent(e) {
    const gogn = localStorage.getItem('data');
    const json = JSON.parse(gogn);
    if (!LectureLocalStorage.getLectureStatus(json.slug)) {
      LectureLocalStorage.saveLectureStatus(json.slug, true);
      e.target.innerHTML = 'Fyrirlestur kláraður';
      e.target.classList.add('klarad');
    } else { // Stilla lecture status sem false og breyta p-tag í svart.
      LectureLocalStorage.saveLectureStatus(json.slug, false);
      LectureLocalStorage.clearLectureBySlug(json.slug);
      e.target.innerHTML = 'Klára fyrirlestur';
      e.target.classList.remove('klarad');
    }
  }
  /**
   * Athuga hvort lectur se nu þegar save-að til þess að frumstilla "fyrirlestur kláraður"
   * @param {*} json gögn um síðuna
   */
  function isLectureFinished(json) {
    if (LectureLocalStorage.getLectureStatus(json.slug)) {
      klara.innerHTML = 'Fyrirlestur kláraður';
      klara.classList.add('klarad');
    } else {
      klara.innerHTML = 'Klára fyrirlestur';
      klara.classList.remove('klarad');
    }
  }
  /**
   * fall til að loada fyrirlestur, kallar á isLecture finished
   * , initFyrirlestur og uploadContent
   */
  function loadContent() {
    const gogn = localStorage.getItem('data');
    const json = JSON.parse(gogn);
    const { content } = json;
    isLectureFinished(json);
    initFyrirlestur(gogn, json);
    uploadContent(content);
  }

  /**
   * Byr til og renderar div tögg í index
   */
  function openLectures() {
    const lectures = Lectures.getLecturesArray();
    for (let i = 0; i < lectures.length; i += 1) {
      const fyrirlestur = el('div');
      const info = el('div');
      const div2 = el('div');
      div2.classList.add('fyrirlestur__infoContent');
      const p = el('p');
      p.classList.add('fyrirlestur__p');
      const cmark = el('h2');
      const h2 = el('h2');
      h2.classList.add('fyrirlestur__h2');
      const check = el('div');
      const img = el('img');
      img.classList.add('fyrirlestrar__img');
      if (lectures[i].thumbnail) {
        img.src = lectures[i].thumbnail;
        fyrirlestur.appendChild(img);
      } else {
        fyrirlestur.classList.add('fyrirlestrar__anmynd');
      }
      check.classList.add('fyrirlestur__check');
      info.classList.add('fyrirlestur__info');
      fyrirlestur.classList.add('fyrirlestur');
      if (lectures[i].title === 'Element') fyrirlestur.classList.add('fyrirlestur__element');
      if (lectures[i].title === 'Box model') fyrirlestur.classList.add('fyrirlestur__boxmodel');
      if (lectures[i].slug === 'js-basic') fyrirlestur.classList.add('fyrirlestur__gildi');
      if (lectures[i].slug === 'js-dom') fyrirlestur.classList.add('fyrirlestur__dom');

      fyrirlestur.setAttribute('id', lectures[i].slug);
      fyrirlestur.classList.add(lectures[i].category);
      fyrirlestur.classList.add(`fyrirlestur__${lectures[i].category}`);
      const pUpper = lectures[i].category.toUpperCase();
      p.innerHTML = pUpper;
      h2.innerHTML = lectures[i].title;
      cmark.innerHTML = '✓';
      cmark.classList.add('fyrirlestur__check-p');
      cmark.classList.add(lectures[i].slug);
      check.appendChild(cmark);
      div2.appendChild(p);
      div2.appendChild(h2);
      info.appendChild(div2);
      info.appendChild(check);
      fyrirlestur.appendChild(info);
      if (LectureLocalStorage.getLectureStatus(lectures[i].slug)) {
        cmark.style.display = 'flex';
      } else {
        cmark.style.display = 'none';
      }
      fyrirlestrar.appendChild(fyrirlestur);
    }
  }
  /**
   * filter fyir takkana til að birta ákveðna fyrirlestra
   */
  function filterContent() {
    html = document.querySelectorAll('.fyrirlestur__html');
    css = document.querySelectorAll('.fyrirlestur__css');
    java = document.querySelectorAll('.fyrirlestur__javascript');
    if ((!btnHtml.classList.contains('btn__active') && !btnCss.classList.contains('btn__active')) && !btnJava.classList.contains('btn__active')) {
      for (let i = 0; i < html.length; i += 1) {
        html[i].classList.toggle('html', false);
      }
      for (let i = 0; i < css.length; i += 1) {
        css[i].classList.toggle('css', false);
      }
      for (let i = 0; i < java.length; i += 1) {
        java[i].classList.toggle('javascript', false);
      }
    }

    // aðeins ef html er active
    if ((btnHtml.classList.contains('btn__active') && !btnCss.classList.contains('btn__active')) && !btnJava.classList.contains('btn__active')) {
      console.log(html.length);
      for (let i = 0; i < html.length; i += 1) {
        console.log(html[i]);
        html[i].classList.toggle('html', false);
      }
      for (let i = 0; i < css.length; i += 1) {
        css[i].classList.toggle('css', true);
      }
      for (let i = 0; i < java.length; i += 1) {
        java[i].classList.toggle('javascript', true);
      }
    }
    // ef öll eru active
    if ((btnHtml.classList.contains('btn__active') && btnCss.classList.contains('btn__active')) && btnJava.classList.contains('btn__active')) {
      console.log(html.length);
      for (let i = 0; i < html.length; i += 1) {
        console.log(html[i]);
        html[i].classList.toggle('html', false);
      }
      for (let i = 0; i < css.length; i += 1) {
        css[i].classList.toggle('css', false);
      }
      for (let i = 0; i < java.length; i += 1) {
        java[i].classList.toggle('javascript', false);
      }
    }
    // aðeins ef html og css eru active
    if ((btnHtml.classList.contains('btn__active') && btnCss.classList.contains('btn__active')) && !btnJava.classList.contains('btn__active')) {
      console.log(html.length);
      for (let i = 0; i < html.length; i += 1) {
        console.log(html[i]);
        html[i].classList.toggle('html', false);
      }
      for (let i = 0; i < css.length; i += 1) {
        css[i].classList.toggle('css', false);
      }
      for (let i = 0; i < java.length; i += 1) {
        java[i].classList.toggle('javascript', true);
      }
    }
    // aðeins ef html og javascript eru active
    if ((btnHtml.classList.contains('btn__active') && !btnCss.classList.contains('btn__active')) && btnJava.classList.contains('btn__active')) {
      console.log(html.length);
      for (let i = 0; i < html.length; i += 1) {
        console.log(html[i]);
        html[i].classList.toggle('html', false);
      }
      for (let i = 0; i < css.length; i += 1) {
        css[i].classList.toggle('css', true);
      }
      for (let i = 0; i < java.length; i += 1) {
        java[i].classList.toggle('javascript', false);
      }
    }
    // aðeins css active
    if ((!btnHtml.classList.contains('btn__active') && btnCss.classList.contains('btn__active')) && !btnJava.classList.contains('btn__active')) {
      console.log(html.length);
      for (let i = 0; i < html.length; i += 1) {
        console.log(html[i]);
        html[i].classList.toggle('html', true);
      }
      for (let i = 0; i < css.length; i += 1) {
        css[i].classList.toggle('css', false);
      }
      for (let i = 0; i < java.length; i += 1) {
        java[i].classList.toggle('javascript', true);
      }
    }
    // css og java active
    if ((!btnHtml.classList.contains('btn__active') && btnCss.classList.contains('btn__active')) && btnJava.classList.contains('btn__active')) {
      console.log(html.length);
      for (let i = 0; i < html.length; i += 1) {
        html[i].classList.toggle('html', true);
      }
      for (let i = 0; i < css.length; i += 1) {
        css[i].classList.toggle('css', false);
      }
      for (let i = 0; i < java.length; i += 1) {
        java[i].classList.toggle('javascript', false);
      }
    }
    // aðeins ef java er active
    if ((!btnHtml.classList.contains('btn__active') && !btnCss.classList.contains('btn__active')) && btnJava.classList.contains('btn__active')) {
      console.log('java');
      for (let i = 0; i < html.length; i += 1) {
        html[i].classList.toggle('html', true);
      }
      for (let i = 0; i < css.length; i += 1) {
        css[i].classList.toggle('css', true);
      }
      for (let i = 0; i < java.length; i += 1) {
        java[i].classList.toggle('javascript', false);
      }
    }
  }
  /**
   * toggla html takka
   */
  function toggleBtnHtml() {
    if (btnHtml.classList.contains('btn__active')) {
      btnHtml.classList.remove('btn__active');
    } else {
      btnHtml.classList.add('btn__active');
    }
    filterContent();
  }
  /**
   * toggla css takka
   */
  function toggleBtnCss() {
    if (btnCss.classList.contains('btn__active')) {
      btnCss.classList.remove('btn__active');
    } else {
      btnCss.classList.add('btn__active');
    }
    filterContent();
  }
  /**
   * toggla javascript takka
   */
  function toggleBtnJava() {
    console.log('java');
    if (btnJava.classList.contains('btn__active')) {
      btnJava.classList.remove('btn__active');
    } else {
      btnJava.classList.add('btn__active');
    }
    filterContent();
  }
  if (isLecturePage) {
    loadContent(); // birta hluti í fyrirlestur
    atag.addEventListener('click', tilBaka);
    klara.addEventListener('click', finishContent);
  } else {
    openLectures(); // rendera div tögg
    localStorage.removeItem('data');
    btnHtml.addEventListener('click', toggleBtnHtml);
    btnCss.addEventListener('click', toggleBtnCss);
    btnJava.addEventListener('click', toggleBtnJava);
    filterContent();
    getClickedItem();
  }
});
