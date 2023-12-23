chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: mainScripts,
    });
  });
});

function mainScripts() {
  async function getDirectURL() {
    const currentUrl = document.URL;
    const videoListDetectionChar = '"formats":';
    const replacementChar = '\\u0026';
    const replacedChar = '&';

    const rawHTML = await fetch(currentUrl).then((response) => response.text());

    const startIndex = rawHTML.indexOf(videoListDetectionChar);
    const lastIndex = rawHTML.indexOf(']', startIndex);

    const rawURLs = rawHTML.slice(
      startIndex + videoListDetectionChar.length,
      lastIndex + 1
    );
    // console.log('raw: ', rawURLs);

    let directURLs = rawURLs.replaceAll(replacementChar, replacedChar);
    directURLs = directURLs.replaceAll('="', "='");
    directURLs = directURLs.replaceAll('""', '""');
    directURLs = JSON.parse(directURLs);

    // console.log('URLs: ', directURLs);
    createVideoFrame(directURLs);
  }

  function createVideoFrame(urls) {
    const frame = document.createElement('div');
    frame.id = 'video-frame';
    frame.style.position = 'absolute';
    frame.style.top = 0;
    frame.style.left = 0;
    frame.style.bottom = 0;
    frame.style.right = 0;
    frame.style.zIndex = 999;
    frame.style.backgroundColor = 'rgba(0,0,0,0.6)';

    const video = document.createElement('video');
    video.controls = true;
    video.style.maxWidth = '100vw';

    urls.forEach((element) => {
      const source = document.createElement('source');
      source.src = element.url;
      let mimeType = element.mimeType.replaceAll('\\"', "'");
      mimeType = mimeType.replaceAll('\\"', "'");
      source.type = mimeType;
    //   console.log('mimeType', mimeType);

      video.append(source);
    });

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = 'Close';
    closeBtn.style.color = 'red';
    closeBtn.onclick = closeVideoFrame;

    const parentDiv = document.createElement('div');
    parentDiv.style.position = 'absolute';
    parentDiv.style.top = '50%';
    parentDiv.style.left = '50%';
    parentDiv.style.transform = 'translate(-50%,-50%)';
    parentDiv.appendChild(video);
    parentDiv.appendChild(closeBtn);

    frame.append(parentDiv);
    document.body.append(frame);
    // console.log('video frame element:', frame);
  }

  function closeVideoFrame() {
    const videoFrame = document.querySelector('#video-frame');
    videoFrame.remove();
  }

  getDirectURL();
}
