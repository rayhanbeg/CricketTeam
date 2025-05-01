import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import uploadService from "./uploadService"

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  imageUrl: null,
  publicId: null,
}

// Upload image
export const uploadImage = createAsyncThunk("upload/image", async (imageData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await uploadService.uploadImage(imageData, token)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Delete image
export const deleteImage = createAsyncThunk("upload/delete", async (publicId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await uploadService.deleteImage(publicId, token)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ""
    },
    clearImage: (state) => {
      state.imageUrl = null
      state.publicId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.imageUrl = action.payload.url
        state.publicId = action.payload.public_id
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteImage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteImage.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
        state.imageUrl = null
        state.publicId = null
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, clearImage } = uploadSlice.actions
export default uploadSlice.reducer
