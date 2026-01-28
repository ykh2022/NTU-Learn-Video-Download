# NTU-Learn-Video-Download
A browser plugin for capturing Kaltura videos from NTU Learn. Supports Chrome-based browsers. For educational purposes only. Do not use on NTULearn. Use at your own risk.

# Installation (Developer Mode)

1. Open Chrome and navigate to:
```chrome://extensions/```


2. Enable Developer mode (top right corner)

3. Click Load unpacked

4. Select the extension folder


The extension will now appear in your toolbar.

# Usage

1. Open: https://ntulearn.ntu.edu.sg/


2. Navigate to a course page that contains a video

When a Kaltura request is detected:
The extension icon badge count increases
A Chrome notification appears
The request URL is logged in the popup panel

If you want to download video, exchange "hls" with "pd" in the url.
