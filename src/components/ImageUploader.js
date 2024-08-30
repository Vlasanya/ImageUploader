import React, { useEffect } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { loadImages, addImages, removeImage } from '../store/imageSlice';

const DragDropBox = styled(Box)({
  border: '2px dashed #ccc',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  marginBottom: '20px',
  '&:hover': {
    borderColor: '#aaa',
  },
});

const ImageUploader = () => {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.images);
  const [dragActive, setDragActive] = React.useState(false);

  useEffect(() => {
    dispatch(loadImages());
  }, [dispatch]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      const newImagesPromises = Array.from(files)
        .filter((file) => file.type.startsWith('image/'))
        .map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result);
            };
            reader.readAsDataURL(file);
          });
        });

      Promise.all(newImagesPromises).then((newImageUrls) => {
        dispatch(addImages(newImageUrls));
      });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const files = event.dataTransfer.files;
    const newImagesPromises = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });

    Promise.all(newImagesPromises).then((newImageUrls) => {
      dispatch(addImages(newImageUrls));
    });
  };

  return (
    <Box sx={{ maxWidth: 500, margin: '0 auto', padding: '40px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Image Upload
      </Typography>

      <Button variant="contained" component="label">
        Choose Images
        <input
          type="file"
          hidden
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </Button>

      <DragDropBox
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{ borderColor: dragActive ? '#666' : '#ccc' }}
      >
        <Typography>
          Drag & Drop images here or click to select (up to 10 images)
        </Typography>
      </DragDropBox>

      {images.length > 0 && (
        <Grid container spacing={2} sx={{ marginTop: '20px' }}>
          {images.map((image, index) => (
            <Grid item xs={6} key={index}>
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                <img
                  src={image}
                  alt={`Uploaded ${index}`}
                  style={{ maxWidth: '100%', borderRadius: '8px' }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => dispatch(removeImage(image))}
                  sx={{ marginTop: '10px' }}
                >
                  Remove
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ImageUploader;
