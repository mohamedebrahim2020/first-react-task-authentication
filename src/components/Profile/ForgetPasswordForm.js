import {  useState, useEffect  } from 'react';
import { useHistory, Link, Redirect,Router } from 'react-router-dom';
import classes from './ForgetPasswordForm.module.css';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from 'formik'
import * as Yup from 'yup'
import useAxios from '../../hooks/use-axios';
import ValidationError from '../error/ValidationError';
import { render } from '@testing-library/react';



const ForgetPasswordForm = () => {
  const history = useHistory();
  const {isLoading, errors, sendRequest: sendAuthRequest} = useAxios();

  const initialValues = {
    email: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Required'),  
  })

  const [successMessage, setSuccessMessage] = useState();
  const [apiEmailError, setApiEmailError] = useState();
  const [generalApiError, setGeneralApiError] = useState();

  const confirm = (response) => {
    console.log(response.data);
    var formattedExpiredTime = new Date(response.data.expires_at * 1000).toString();
    setSuccessMessage(`your otp code sent successfully to your mail and it will be expired at:: ${formattedExpiredTime}`)
    setTimeout(()=>{history.replace("/otp");}, 2000);
  }

  const submitHandler = (values) => {
    const enteredEmail = {email: values.email}
    const api = 'api/v1/users/password/forget'
    sendAuthRequest({
      api:api,
      method:'post',
      body: enteredEmail,
      headers: {
        'Content-Type': 'application/json',
      },

    }, confirm);

}

const handleErrors = (errors) => {
  if (errors.status !=422) {
    setGeneralApiError(errors.statusText)
  }
  if (errors.status ==422) {
    setApiEmailError(errors.data.errors[0].error)
  }
}

useEffect(() => {
  if (errors && !isLoading) {
    handleErrors(errors)
  }
},[isLoading,errors])

  return (
    <>
    <div className={'justifyContent:center'}>
    <center><h3>Forget Password</h3></center>
    </div>
    <Formik
      initialValues={ initialValues}
      validationSchema={ validationSchema}
      onSubmit={submitHandler}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
    <Form className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='email'>Email</label>
        <Field type='email' id='email' name='email' />
          <ErrorMessage name='email' component={ValidationError}/>
          {apiEmailError && <div> <span > {apiEmailError}</span></div>}
          {generalApiError&&<div><span >{generalApiError}</span></div>}   
          {successMessage && <div><span>{successMessage}</span></div>}
      </div>
      <center>
      <div className={classes.action}>
        <button disabled={isLoading}>Submit</button>
      </div>
      <div className={classes.action}>
        <Link to='/auth'>Back to Login</Link>
      </div>
      </center>
    </Form>
    </Formik>
    </>
  );
};

export default ForgetPasswordForm;