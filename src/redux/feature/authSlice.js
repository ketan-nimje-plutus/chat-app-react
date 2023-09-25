import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postdata } from "../../Utils/http.class";
import jwtDecode from "jwt-decode";
import { socket } from "../../socket";

let token = localStorage.getItem("user") ? localStorage.getItem("user") : null;
let user = null;

if (token) {
  user = jwtDecode(token);
}
let initialState = {
  user: {
    id: user?.id ? user.id : null,
    fullName: user?.fullName ? user.fullName : null,
    email: user?.email ? user.email : null,
    contactNumber: user?.contactNumber ? user.contactNumber : null,
  },
  isLoggin: user ? true : false,
  errorMsg: null,
};

export const loginUser = createAsyncThunk("user/login", async (data) => {
  try {
    const res = await postdata("user/login", data);
    const response = await res.json();
    console.log(response,'responseresponse');
    
    if (response.status === 1) {
      localStorage.setItem("user", response.token);
      const userData = jwtDecode(response.token);
      socket.emit("login", userData.id);
      
      return {
        user: {
          id: userData.id,
          contactNumber: userData.contactNumber,
          email: userData.email,
          fullName: userData.fullName,
        },
        isLoggedIn: true,
        errorMsg: null,
      };
    } else {
      return {
        errorMsg: response.message,
        isLoggedIn: false,
      };
    }
  } catch (error) {
    return {
      errorMsg: "Something went wrong",
      isLoggedIn: false,
    };
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state, action) => {
      localStorage.clear();
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoggingIn = true;
        state.errorMsg = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = action.payload.isLoggedIn;
        state.isLoggingIn = false;
        state.errorMsg = action.payload.errorMsg;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.errorMsg = action.payload.errorMsg;
      });
  },
});

export default authSlice.reducer;
export const { logoutUser } = authSlice.actions;
