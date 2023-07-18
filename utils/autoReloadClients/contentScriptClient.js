const init = (response) => {
  let recruiter = null;
  let company = null;
  const recruiterTag = document.getElementsByTagName('h1');
  if (recruiterTag && recruiterTag[0] && recruiterTag[0].innerText) {
    recruiter = recruiterTag[0].innerText;
  }
  const title =
    'inline-show-more-text inline-show-more-text--is-collapsed inline-show-more-text--is-collapsed-with-line-clamp inline';
  var elements = document.getElementsByClassName(title);
  if (elements && elements[0] && elements[0].innerText) {
    company = elements[0].innerText.trim();
  }
  response({ recruiter, company });
};

chrome.runtime.onMessage.addListener(function (request, sender, response) {
  if (request.message === 'start') {
    init(response);
  }
});
