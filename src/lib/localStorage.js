/*
  Module that handles the saving, loading and modifying of data in localStorage
*/

const LOCALSTORAGE_KEY = 'lectureComplete';

export default class LectureLocalStorage {
  /**
   * Check to see if lecture has been completed.
   *
   * @param {string} slug for the lecture status being saved
   * Returns true if there is an entry in localstorage and
   * the lecture is saved as completed, otherwise returns false.
   *
   */
  static getLectureStatus(slug) {
    // console.log('localStorage: ', localStorage);
    let lectureStatus = false;

    if (slug != null) {
      const lectureStatusJSON = localStorage.getItem(`${LOCALSTORAGE_KEY}-${slug}`);
      const lectureStatusObj = JSON.parse(lectureStatusJSON);

      if (lectureStatusObj != null) {
        lectureStatus = lectureStatusObj.completed;
      }
    }

    return lectureStatus;
  }

  /**
   * Saves the completion status of passed lecture in localstorage.
   *
   * @param {string} slug for the lecture status being saved
   * @param {boolean} true or false statement, signifying whether lecture is completed or not
   */
  static saveLectureStatus(slug, bCompleted) {
    const mediaJSON = `{"completed": "${bCompleted}"}`;
    localStorage.setItem(`${LOCALSTORAGE_KEY}-${slug}`, mediaJSON);

    // console.log('Lecture completions status saved.');
  }

  /**
   * Remove a specific lecture item from local storage by slug
   * @param {string} slug of the lecture localstorage data to clear
   */
  static clearLectureBySlug(slug) {
    localStorage.removeItem(`${LOCALSTORAGE_KEY}-${slug}`);
  }

  // Clears all local storage.
  static clearAllLocalStorage() {
    localStorage.clear();
  }

  static localStorageTest1() {
    // let completed = null;
    // saveLectureStatus('slug-test', true);
    // completed = getLectureStatus('slug-test');
    // console.log('lecture completion status: ', completed);

    // saveLectureStatus('slug-test', false);
    // completed = getLectureStatus('slug-test');
    // console.log('lecture completion status: ', completed);

    // clearLectureBySlug('slug-test');
    // completed = getLectureStatus('slug-test');
    // console.log('lecture completion status: ', completed);
  }
}
