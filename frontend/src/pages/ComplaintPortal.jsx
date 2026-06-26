import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCamera, FaImage, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/ComplaintPortal.css';
import { toast } from 'react-toastify';
import useAuthStore from '../store/auth.token.js';
import axios from 'axios';

function ComplaintPortal() {
  const accessToken = useAuthStore.getState().accessToken;
  const [user, setUser] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function reverseGeocode(lat, lon) {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat,
          lon,
          format: 'json',
        },
      });
      setLocation(response.data.display_name);
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  useEffect(() => {
    axios
      .get('http://localhost:3000/auth/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((payload) => {
        setUser(payload.data.fullName);
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Could not load profile'));
  }, [accessToken]);

  const handleSubmit = () => {
    if (title.trim() === '' || description.trim() === '' || location.trim() === '') {
      toast.error('Please fill in all text fields (Title, Description, Location)');
      return;
    }
    if (!image) {
      toast.error('Please select an image before submitting');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('user', user);
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('location', location.trim());

    axios
      .post('http://localhost:3000/complaints/register', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((status) => toast.success(status.data.message))
      .catch((err) => toast.error(err.response?.data?.message || 'Submission failed'));
  };

  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -50 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <motion.div
      className="complaint-container"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Link to="/dashboard" className="back-link" aria-label="Back to Dashboard">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </Link>

      <div className="complaint-card">
        <section className="complaint-form-section">
          <div className="complaint-header">Register Complaint</div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. Pothole near Kurla Station"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Provide details about the issue..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <button
              type="button"
              className={`location-btn ${location ? 'detected' : ''}`}
              onClick={() => {
                navigator.geolocation.getCurrentPosition(async (position) => {
                  const lat = position.coords.latitude;
                  const lon = position.coords.longitude;
                  await reverseGeocode(lat, lon);
                });
              }}
            >
              {location ? location : <><FaMapMarkerAlt /> Detect Location</>}
            </button>
          </div>

          <button type="button" className="btn-submit" onClick={handleSubmit}>
            Submit
          </button>
        </section>

        <section className="complaint-image-section">
          <input
            id="img-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleImageFile(e.target.files[0])}
          />

          <div className="img-card-close-row">
            <span className="img-card-label">Photo Evidence</span>
          </div>

          {imagePreview ? (
            <div className="img-full-cover">
              <img src={imagePreview} alt="preview" className="img-full-photo" />
              <div className="img-full-overlay">
                <div className="img-full-overlay-text">
                  <FaImage className="img-full-overlay-icon" />
                  <span className="img-full-filename">{image?.name || 'Photo attached'}</span>
                </div>
                <div className="img-full-overlay-actions">
                  <button
                    type="button"
                    className="img-overlay-btn img-overlay-btn--change"
                    onClick={() => document.getElementById('img-input').click()}
                  >
                    <FaCamera /> Change
                  </button>
                  <button
                    type="button"
                    className="img-overlay-btn img-overlay-btn--remove"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    <FaTimes /> Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`img-card-body ${dragging ? 'dragging' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleImageFile(e.dataTransfer.files[0]);
              }}
            >
              <div className="img-circle" onClick={() => document.getElementById('img-input').click()}>
                <FaCamera className="img-circle-icon" />
              </div>
              <div className="img-card-text">
                <p className="img-card-heading">Add a Photo</p>
                <p className="img-card-sub">Click the camera or drag and drop an image here</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
}

export default ComplaintPortal;

