import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User, initialUserState, initialUsersState } from "../interfaces";

export const fetchUser = createAsyncThunk<
  User,
  number,
  { rejectValue: string }
>("user/fetchUser", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const data: User = await response.json();
    return data;
  } catch (error) {
    // We reject with value to provide the action with a payload (the error message in this case)
    return rejectWithValue((error as Error).message);
  }
});

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data: User[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: { user: initialUserState, users: initialUsersState },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle state updates when fetchUser is pending
      .addCase(fetchUser.pending, (state) => {
        state.user.status = "loading";
        state.user.error = null;
      })
      // Handle state updates when fetchUser is fulfilled
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user.entity = action.payload;
        state.user.status = "succeeded";
      })
      // Handle state updates when fetchUser is rejected
      .addCase(fetchUser.rejected, (state, action) => {
        state.user.status = "failed";
        state.user.error = action.payload ?? "An error occurred";
      })
      // Handle state updates when fetchUsers is pending
      .addCase(fetchUsers.pending, (state) => {
        state.users.status = "loading";
        state.users.error = null;
      })
      // Handle state updates when fetchUsers is fulfilled
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.entities = action.payload;
        state.users.status = "succeeded";
      })
      // Handle state updates when fetchUsers is rejected
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.status = "failed";
        state.users.error = action.payload ?? "An error occurred";
      });
  },
});

export default userSlice.reducer;
