import {useState, useEffect, Fragment, useRef  } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {usersActions} from '../../store/index';
import useAxios from '../../hooks/use-axios';
import ReactPaginate from 'react-paginate';
import classes from './Users.module.css';
import User from './User';


const Users = () => {
    const {sendRequest: sendUsersRequest} = useAxios();
    const dispatch = useDispatch();
    const users = useSelector(state => state.users);
    const current_page = useSelector(state => state.current_page);
    const [pagesCount,setPagesCount]= useState(1);
    const [searchingname, setSearchingName] = useState(null);
    let api = `api/v1/users?page=${current_page}&name=${searchingname}`;
    const nameRef = useRef()


    const submitSearch = (event) => {
        event.preventDefault();
        dispatch(usersActions.saveCurrentPage(0));
        setSearchingName(nameRef.current.value);
    }
    
    const usersResponse = (response) => {
        
        if (response.meta.total>0) {
            dispatch(usersActions.saveUsersCount(response.meta.total));
            dispatch(usersActions.saveUsers(response.data))
            dispatch(usersActions.saveCurrentPage(response.meta.current_page))
            dispatch(usersActions.saveHasNext(response.meta.has_next))
        }
        setPagesCount(Math.ceil(response.meta.total/10))
    }
    useEffect(() => {
        sendUsersRequest({
            api:api,
            headers: {
              'Content-Type': 'application/json',
            },
      
          }, usersResponse);
    },[sendUsersRequest, api])

    const handlePageChange = (selectedObject) => {
        console.log(selectedObject.selected);
        dispatch(usersActions.saveCurrentPage(selectedObject.selected+1))
    }
 


    return ( 
    <Fragment>
    <center>
    <h2>users</h2>
    <div>
    <form onSubmit={submitSearch}>  
    <input type='text' ref={nameRef}></input> 
    <button >search</button>
    </form>  
    </div>
    </center> 
    <div className={classes.users}>
    <ul>
    {users.map((user) => (
        <User user={user} key={user.id}></User>
    ))}
    </ul>
    </div>
    <ReactPaginate
					pageCount={pagesCount}
					pageRange={2}
					marginPagesDisplayed={2}
					onPageChange={handlePageChange}
					containerClassName={classes.container}
					previousLinkClassName={classes.page}
					breakClassName={classes.page}
					nextLinkClassName={classes.page}
					pageClassName={classes.page}
					disabledClassNae={classes.disabled}
					activeClassName={classes.active}
				/>
    </Fragment> 
    );
}
 
export default Users;