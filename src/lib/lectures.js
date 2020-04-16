/*
  functions to handle data for lectures
*/

const LECTUREFILENAME = 'lectures.json';

export default class Lectures {
  // reads and returns local json file, pass filename of a json file in the root of the server
  static readLocalJSON(filename) {
    const req = new XMLHttpRequest();
    req.open('GET', `${window.location.href}/${filename}`, false);
    req.send(null);
    if (req.status === 200) {
      return req.responseText;
    }
    return null;
  }

  // returns JSON object of all lectures
  static getLecturesJSON() {
    const lecturesJSON = JSON.parse(this.readLocalJSON(LECTUREFILENAME));
    return lecturesJSON;
  }

  /** returns Array with data for all lectures
      How to use:
        const data = getLecturesArray();
        console.log('first entry, slug', data[0].slug);
        console.log('first entry, data content for first entry', data[0].content);
  */
  static getLecturesArray() {
    const lecturesJSON = this.getLecturesJSON();
    const lectures = Object.entries(lecturesJSON);

    return lectures[0][1];
  }

  /**  return one lecture, found by slug passed,
     * returns lecture JSON object if found, returns null if not found
     * How to use:
     *   const data = getLectureBySlug('some-slug-string');
     *   console.log('single entry data returned', data);
     *   console.log('single entry data returned, title', data.title);

     * @param {string} slug for the lecture to be returned
  */
  static getLectureBySlug(slug) {
    const lectures = this.getLecturesArray();

    let lecture = null;
    for (let n = 0; n < Object.keys(lectures).length; n += 1) {
      if (lectures[n].slug === slug) {
        lecture = lectures[n];
      }
    }
    return lecture;
  }
}
