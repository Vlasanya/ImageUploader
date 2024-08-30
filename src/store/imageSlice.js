import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  images: [],
};

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    loadImages: (state) => {
      const storedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
      state.images = storedImages;
    },
    addImages: (state, action) => {
      const newImages = action.payload;
      const updatedImages = [...state.images, ...newImages].slice(0, 10);
      state.images = updatedImages;
      localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
    },
    removeImage: (state, action) => {
      const imageUrl = action.payload;
      const updatedImages = state.images.filter((image) => image !== imageUrl);
      state.images = updatedImages;
      localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
    },
  },
});

export const { loadImages, addImages, removeImage } = imageSlice.actions;

export default imageSlice.reducer;
