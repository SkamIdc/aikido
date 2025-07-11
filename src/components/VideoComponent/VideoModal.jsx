import { useEffect } from 'react';
import './VideoModal.css';

function VideoModal({ videoLink, closeModal }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);

  return (
    <>
      <div className="video__modal">
        <button className='button close__video__button' onClick={closeModal}>x</button>
        <div className="video__content">
          <video className="technique__video" controls>
            <source src={videoLink} type="video/mp4" />
          </video>
        </div>
      </div>
    </>
  );
}

export default VideoModal;
