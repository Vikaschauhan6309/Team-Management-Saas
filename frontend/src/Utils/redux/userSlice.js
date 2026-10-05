import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name : "User",
    initialState : null,
    reducers : {
        addUserData : (state, action) =>
        {
            return action.payload
        },
        removeUserData : () =>
        {
            return null
        }
    }
})


export default UserSlice.reducer
export const{ addUserData, removeUserData } = UserSlice.actions