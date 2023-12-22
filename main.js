async function getDirectURL() {
  const currentUrl = document.URL;
  const firstChar = 'https://rr3';
  const lastChar = '","mimeType"';
  const unicodeChar = '\\u0026';
  const replacedChar = '&';

  const rawHTML = await fetch(currentUrl).then((rawData) => rawData.text());
  const firstIndex = rawHTML.indexOf(firstChar);
  const lastIndex = rawHTML.indexOf(lastChar);
  const rawURL = rawHTML.slice(firstIndex, lastIndex);
  const directURL = rawURL.replaceAll(unicodeChar, replacedChar);

  console.log('directURL = ', directURL);
  createVideoFrame(directURL);
}

const createVideoFrame = (url) => {
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
  video.src = url;

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
  console.log('video frame element:', frame);
};

const closeVideoFrame = () => {
  const videoFrame = document.querySelector('#video-frame');
  videoFrame.remove();
};
