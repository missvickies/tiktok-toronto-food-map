import React, { useRef, useEffect, useState } from 'react';

const LazyLoadMedia = ({ item, isOpen, onClose }) => {
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    const video = videoRef.current;

    const handleMouseEnter = () => {
      if (!isVideoPlaying) {
        setIsVideoPlaying(true);
        video.style.display = 'block';
        video.currentTime = 0; // Reset video to start
        video.play().catch((error) => {
          console.error('Error playing video:', error);
        });
        image.style.display = 'none';
      }
    };

    const handleMouseLeave = () => {
      if (isVideoPlaying) {
        setIsVideoPlaying(false);
        video.pause();
        video.style.display = 'none';
        image.style.display = 'block';
      }
    };

    image.addEventListener('mouseenter', handleMouseEnter);
    image.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      image.removeEventListener('mouseenter', handleMouseEnter);
      image.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVideoPlaying]);

  useEffect(() => {
    const video = videoRef.current;

    // When the drawer is open and the selected pin changes
    if (isOpen && item && item.id !== video.dataset.currentItemId) {
      // Pause and hide current video if playing
      if (isVideoPlaying) {
        setIsVideoPlaying(false);
        video.pause();
        video.style.display = 'none';
        imageRef.current.style.display = 'block';
      }

      // Update video source and display new video
      video.src = item.videoMeta.downloadAddr;
      video.dataset.currentItemId = item.id;

      // Autoplay the video
      setIsVideoPlaying(true);
    }
  }, [isOpen, item, isVideoPlaying]);

  useEffect(() => {
    const video = videoRef.current;

    // Stop and hide video when the drawer is closed
    if (!isOpen && isVideoPlaying) {
      setIsVideoPlaying(false);
      video.pause();
      video.style.display = 'none';
      imageRef.current.style.display = 'block';
    }
  }, [isOpen, isVideoPlaying, onClose]);

  if (!item || !item.videoMeta) {
    return null;
  }

  return (
    <div className="lazy-load-media">
      <img ref={imageRef} src={item.videoMeta.coverUrl} alt="Cover" style={{ display: isVideoPlaying ? 'none' : 'block', maxWidth: '300px' }} />
      <video ref={videoRef} className="popup-video" style={{ display: isVideoPlaying ? 'block' : 'none', maxWidth: '350px' }} autoPlay controls>
        <source preload="none" src={item.videoMeta.downloadAddr} type="video/mp4" />
      </video>
    </div>
  );
};

export default LazyLoadMedia;
