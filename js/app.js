document.addEventListener('DOMContentLoaded', start);

function start() {
  var twitterProfile = getParameterByName('twitterHandler');
  var talkToMe = getParameterByName('interests');

  if (!twitterProfile || !talkToMe) {
    return renderError();
  }

  fetch(twitterProfile, function(data) {
    if (!data || !Array.isArray(data) || data.length !== 1) {
      return renderError();
    }

    data[0].interests = talkToMe;
    render(data[0]);

  });
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return null;
  return decodeURIComponent(results[2].replace(/\+/g, " ")).trim();
}

function fetch(profileId, cb) {
  var twitterUrl = 'https://www.twitter.com/' + profileId;
  // Perform a call to the metadata server
  var payload = {
    objects:[
      {
        url: twitterUrl
      }
    ],
    adaptors: [
      {
        pattern: "^https?\:\/\/?(?:www\.)?twitter\.com\/.+$",
        url: "http://box.wilsonpage.me/magnet-twitter-adaptor"
      }
    ]
  };
  var metadataService = 'https://tengam.org/api/v1/metadata';
  var xhr = new XMLHttpRequest();
  xhr.open('POST', metadataService);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {
      if (xhr.status == 200) {
        cb(JSON.parse(xhr.responseText));
      } else {
        return null;
      }
    }
  };
  xhr.send(JSON.stringify(payload));
}

function render(data) {
  var title = document.getElementById('title');
  title.textContent = data.title;
  var head = document.getElementById('head');
  head.style.backgroundImage = 'url(' + data.image + ')';
  var profile = document.getElementById('profile_pic');
  profile.style.backgroundImage = 'url(' + data.icon + ')';
  // var content = document.getElementById('content');
  // content.style.background = data.theme_color;
  var interests = document.getElementById('interests');

  var userInterests = document.createElement('p');
  userInterests.textContent = data.interests;
  interests.appendChild(userInterests);

  document.body.classList.remove('hidden');
}

function renderError() {

}
