import OtpCodeForm from "../components/Profile/OtpCodeForm";
import {Route} from 'react-router-dom';

const OtpCodePage = () => {
  return (
    <Route path='/otp'>
    <OtpCodeForm></OtpCodeForm>
    </Route>
  );
};

export default OtpCodePage

