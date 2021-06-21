import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialState = {
    usersCount : 0,
    backEndError:null,
    users:[],
    has_next: false, 
    current_page: 1
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: { 
          // must be reducers
        saveUsersCount(state,action){
            state.usersCount = action.payload
        },  
        saveUsers(state, action){
            if (state.usersCount >0) {
                console.log(action.payload);
                state.users = action.payload
            }
        },
        saveCurrentPage(state, action){
            state.current_page = action.payload
        },
        saveHasNext(state,action){
            state.has_next =  action.payload
        },
        showError(){
            console.log('server error');
        },
    }
})

const store = configureStore({
    reducer: usersSlice.reducer
});

export const usersActions = usersSlice.actions;
export default store;