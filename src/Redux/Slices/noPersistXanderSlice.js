import { createSlice } from "@reduxjs/toolkit";

const initialState = {
reFetchModel: false
}
export const noPersistXanderSlice = createSlice({
    name: 'noPersistXanderSlice', 
    initialState,
    reducers:{
        setRefetchModels:(state, action)=>{
            console.log(state, action.payload, "data-->>")
            state.reFetchModel = action.payload;
        },
    }
})

export const {setRefetchModels} = noPersistXanderSlice.actions;
export default noPersistXanderSlice.reducer;
