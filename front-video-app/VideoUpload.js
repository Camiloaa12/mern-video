import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('video', video);

    const response = await axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    setVideoUrl(response.data.url);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleUpload} />
        <button type="submit">Upload Video</button>
      </form>
      {videoUrl && (
        <div>
          <h3>Uploaded Video:</h3>
          <video width="600" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
