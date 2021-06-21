import {  useState, useEffect  } from 'react';
import { useHistory, Link, Redirect } from 'react-router-dom';
import classes from './OtpCodeForm.module.css';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from 'formik'
import * as Yup from 'yup'
import useAxios from '../../hooks/use-axios';
import ValidationError from '../error/ValidationError';



const OtpCodeForm = () => {
  const {isLoading, errors, sendRequest: sendAuthRequest} = useAxios();
  const history = useHistory();

  const initialValues = {
    email: '',  
    otp: '',
    password: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),  
    otp: Yup.string().required('Required'), 
    password: Yup.string().required('Required').min(8), 
  })

  const [successMessage, setSuccessMessage] = useState();
  const [apiEmailError, setApiEmailError] = useState();
  const [generalApiError, setGeneralApiError] = useState();

  const successResponse = (response) => {
    setSuccessMessage('your password changed successfully ');
    setTimeout(()=>{history.replace("/auth");}, 2000);
  }

  const submitHandler = (values) => {
      setApiEmailError()
      setGeneralApiError()
    const data = {email: values.email, token: values.otp, password:values.password}
    const api = 'api/v1/users/password/reset'
    sendAuthRequest({
      api:api,
      method:'post',
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },

    }, successResponse);

}

const handleErrors = (errors) => {
    console.log(errors);
    if (errors.status !=422) {
        setGeneralApiError('token or email '+ errors.statusText)
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
    <center><h3>Enter Otp Code</h3></center>
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
      </div>
      <div className={classes.control}>
        <label htmlFor='otp'>otp</label>
        <Field type='otp' id='otp' name='otp' />
          <ErrorMessage name='otp' component={ValidationError}/>
      </div>
      <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <Field
            type='password'
            id='password'
            name='password'
          />
           <ErrorMessage name='password' component={ValidationError}/>
        </div>
       {generalApiError && <div><span>{generalApiError}</span></div>}
       {successMessage && <div><span>{successMessage}</span></div>}
      <center>
      <div className={classes.action}>
        <button disabled={isLoading}>Submit</button>
      </div>
      </center>
    </Form>
    </Formik>
    </>
  );
};

export default OtpCodeForm;