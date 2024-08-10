import { createSlice } from "@reduxjs/toolkit";

const initialState = {
allNotificationsObjects : []
}
export const xanderSlice = createSlice({
    name: 'xanderSlice', 
    initialState,
    reducers:{
        setAllNotificationsObjects:(state, action)=>{
            state.allNotificationsObjects = action.payload;
        },
    }
})

export const {setAllNotificationsObjects} = xanderSlice.actions;
export default xanderSlice.reducer;
