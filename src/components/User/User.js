import classes from './User.module.css'

const User = (props) => {

    return ( 
        <li className={classes.user}>
            <div>
            <h3>{props.user.name}</h3>
            <div><span className={classes.email}>{props.user.email}</span></div>
            <div><span className={classes.phone}>{props.user.mobile_number}</span></div>
            </div>
        </li>
    );
}
 
export default User;